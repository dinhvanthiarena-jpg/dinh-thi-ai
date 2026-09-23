const crypto = require('crypto');
const { Op } = require('sequelize');
const { User, WalletTransaction, WithdrawRequest, AffiliateLink } = require('../models');
const wallet = require('../services/walletService');
const commission = require('../services/commissionService');

const SAFE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function chuoiNgau(n) {
  return Array.from(crypto.randomFillSync(new Uint8Array(n))).map((b) => SAFE_CHARS[b % SAFE_CHARS.length]).join('');
}
async function maLinkDuyNhat() {
  let ma = chuoiNgau(8);
  for (let i = 0; i < 5 && (await AffiliateLink.findOne({ where: { affiliateCode: ma } })); i += 1) ma = chuoiNgau(8);
  return ma;
}

// Đại lý hay dán nguyên link copy từ thanh địa chỉ trình duyệt (VD
// "https://3dvietpro.com/courses/ten-khoa-hoc") thay vì tự gõ đường dẫn rút
// gọn "/courses/ten-khoa-hoc" — chấp nhận cả 2 kiểu cho dễ dùng, nhưng vẫn
// CHỈ cho link thuộc chính site này (yêu cầu 2026-09-23: "chỉ tracking được
// link trên 3dvietpro thôi"), tránh bị lợi dụng làm open-redirect sang site
// khác qua originalUrl.
function chuanHoaDuongDan(input, req) {
  const raw = String(input || '').trim();
  if (raw.startsWith('/')) {
    if (raw.startsWith('//')) throw new Error('Đường dẫn không hợp lệ.');
    return raw;
  }

  let url;
  try {
    url = new URL(raw.includes('://') ? raw : `https://${raw}`);
  } catch (err) {
    throw new Error('Link không hợp lệ. Dán nguyên link trang trên 3dvietpro.com hoặc đường dẫn dạng /courses/ten-khoa-hoc.');
  }

  const hostHienTai = req.hostname.replace(/^www\./, '');
  const hostLink = url.hostname.replace(/^www\./, '');
  if (hostLink !== hostHienTai) {
    throw new Error(`Chỉ tạo link tracking cho trang trên ${req.hostname} thôi, không dùng được link ngoài.`);
  }
  return `${url.pathname}${url.search}${url.hash}` || '/';
}

// Chưa đăng ký hoặc bị từ chối trước đó -> chỉ thấy form đăng ký làm đại lý.
// Đang chờ duyệt -> chỉ thấy thông báo chờ. Chỉ 'approved' mới thấy dashboard
// đầy đủ (ví, mạng lưới, đơn hàng & hoa hồng của cấp dưới) — xem yêu cầu
// 2026-09-23: "đại lý đăng ký mà mình sẽ duyệt, trên tài khoản đại lý có ví,
// có thông tin, có cả các thông tin về đơn hàng, về hoa hồng về hoa hồng
// cấp dưới của họ".
exports.index = async (req, res) => {
  const user = req.user;

  if (user.agentStatus !== 'approved') {
    return res.render('referral/index', {
      title: 'Giới thiệu bạn bè',
      agentStatus: user.agentStatus,
    });
  }

  const f1 = await User.findAll({
    where: { parentId: user.id },
    attributes: ['id', 'name', 'email', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });
  const f1Ids = f1.map((u) => u.id);
  const f2 = f1Ids.length
    ? await User.findAll({
        where: { parentId: { [Op.in]: f1Ids } },
        attributes: ['id', 'name', 'email', 'parentId', 'createdAt'],
        order: [['createdAt', 'DESC']],
      })
    : [];
  const f2Ids = f2.map((u) => u.id);
  const f3 = f2Ids.length
    ? await User.findAll({
        where: { parentId: { [Op.in]: f2Ids } },
        attributes: ['id', 'name', 'email', 'parentId', 'createdAt'],
        order: [['createdAt', 'DESC']],
      })
    : [];

  const commissionHistory = await WalletTransaction.findAll({
    where: { UserId: user.id, type: { [Op.in]: ['commission_l1', 'commission_l2', 'commission_l3'] } },
    order: [['createdAt', 'DESC']],
    limit: 50,
  });
  const totalCommission = commissionHistory.reduce((sum, tx) => sum + tx.amount, 0);
  const hoaHongChoDuyet = commissionHistory
    .filter((tx) => tx.status === 'pending')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const withdrawRequests = await WithdrawRequest.findAll({
    where: { UserId: user.id },
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  const affiliateLinks = await AffiliateLink.findAll({
    where: { UserId: user.id },
    order: [['createdAt', 'DESC']],
    limit: 20,
  });

  const chiTiet = await commission.chiTietThanhVien(user.id);
  const donHangMang = await commission.danhSachDonHangMang(user.id, 20);

  res.render('referral/index', {
    title: 'Giới thiệu bạn bè',
    agentStatus: user.agentStatus,
    refCode: user.refCode,
    soDu: wallet.soDu(user),
    f1,
    f2,
    f3,
    commissionHistory,
    totalCommission,
    hoaHongChoDuyet,
    withdrawRequests,
    affiliateLinks,
    chiTiet,
    donHangMang,
  });
};

// User bấm "Đăng ký làm đại lý" -> chuyển sang 'pending', chờ Admin duyệt ở
// /admin/aff/dai-ly. Chỉ cho đăng ký lại từ 'none' hoặc 'rejected' — tránh 1
// người bấm gửi nhiều lần khi đang 'pending' hoặc đã 'approved' rồi.
exports.dangKyDaiLy = async (req, res) => {
  const user = req.user;
  if (user.agentStatus === 'none' || user.agentStatus === 'rejected') {
    await user.update({ agentStatus: 'pending' });
    req.flash('success', 'Đã gửi đăng ký làm đại lý, vui lòng chờ admin duyệt.');
  }
  res.redirect('/gioi-thieu-ban-be');
};

// Đại lý tự tạo link riêng cho 1 trang cụ thể (khóa học/tool) kèm nhãn
// nguồn/chiến dịch — xem chuanHoaDuongDan() ở trên cho quy tắc chấp nhận
// link.
exports.createLink = async (req, res) => {
  const user = req.user;
  const utmSource = String(req.body.utmSource || '').trim().slice(0, 100);
  const utmCampaign = String(req.body.utmCampaign || '').trim().slice(0, 100);

  try {
    if (user.agentStatus !== 'approved') throw new Error('Bạn cần được duyệt làm đại lý trước.');
    const originalUrl = chuanHoaDuongDan(req.body.originalUrl, req);
    const affiliateCode = await maLinkDuyNhat();
    await AffiliateLink.create({ UserId: user.id, originalUrl, affiliateCode, utmSource, utmCampaign });
    req.flash('success', 'Đã tạo link tracking riêng.');
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect('/gioi-thieu-ban-be');
};

exports.requestWithdraw = async (req, res) => {
  const user = req.user;
  const amount = Number(req.body.amount);
  const { bankName, bankAccount, bankAccountName } = req.body;

  try {
    if (user.agentStatus !== 'approved') throw new Error('Bạn cần được duyệt làm đại lý trước.');
    if (!Number.isInteger(amount) || amount < 50000) throw new Error('Số tiền rút tối thiểu 50.000đ.');
    if (amount > wallet.soDu(user)) throw new Error('Số dư ví không đủ.');
    if (!bankName || !bankAccount || !bankAccountName) throw new Error('Vui lòng nhập đầy đủ thông tin ngân hàng.');

    await WithdrawRequest.create({
      UserId: user.id,
      amount,
      bankName,
      bankAccount,
      bankAccountName,
      status: 'pending',
    });
    req.flash('success', 'Đã gửi yêu cầu rút tiền, admin sẽ duyệt và chuyển khoản sớm.');
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect('/gioi-thieu-ban-be');
};
