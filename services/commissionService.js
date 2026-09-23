/**
 * Hoa hồng "Giới thiệu bạn bè" — mô hình 3 cấp WEB -> A -> B -> C (đúng theo
 * đặc tả thầy gửi 23/09/2026, "Dac_ta_he_thong_ban_hang_Affiliate_3_cap"):
 *   - Khách mua hàng qua link của C -> C nhận hoa hồng Cấp 1 (trực tiếp).
 *   - B (người giới thiệu C) nhận hoa hồng Cấp 2 trên CHÍNH đơn hàng đó.
 *   - A (người giới thiệu B) nhận hoa hồng Cấp 3 trên CHÍNH đơn hàng đó.
 * Hệ thống hiện KHÔNG có role A/B/C cố định riêng — MỌI user đều bình đẳng,
 * "là A hay B hay C" chỉ là vị trí tương đối trong cây parentId tại thời
 * điểm 1 đơn hàng cụ thể phát sinh (một người có thể vừa là B của đơn này
 * vừa là A của đơn khác). Điều này đơn giản hơn nhiều so với việc quản lý
 * role/quyền tách biệt theo cấp, mà vẫn tự nhiên thỏa "chỉ xem được mình +
 * cấp dưới" (mỗi dashboard vốn đã tự lọc theo req.user.id).
 *
 * WALLET LEDGER — Pending -> Available (mục 13 trong đặc tả, "không sửa
 * trực tiếp số dư ví"): mỗi hoa hồng khi phát sinh được ghi
 * WalletTransaction với status='pending' TRƯỚC, CHƯA cộng vào
 * user.walletBalance (walletBalance = số dư "khả dụng", chỉ tính giao dịch
 * status='paid'). Sau PENDING_DAYS ngày (mặc định chốt 7 ngày — đủ thời
 * gian huỷ/hoàn đơn trước khi tiền thật sự khả dụng để rút), hệ thống tự
 * chuyển sang 'paid' và CỘNG vào walletBalance lúc đó (xem
 * duyetHoaHongDaHan, chạy định kỳ trong server.js). Admin cũng duyệt sớm
 * tay được cho 1 người cụ thể (xem duyetHoaHongSom).
 *
 * Gọi distributeCommission() ở ĐÚNG 3 nơi tiền thật/ví thật đã được ghi
 * nhận thanh toán xong (KHÔNG gọi lúc tạo đơn, chỉ gọi khi đã chắc chắn đã
 * trả tiền):
 *   - services/walletService.js#muaTool
 *   - services/walletService.js#thanhToanHocPhiBangVi
 *   - controllers/checkoutController.js#mockPayConfirm
 *   - services/proService.js#ghiNhanDaTra
 */
const { Op } = require('sequelize');
const { Setting, User, WalletTransaction, WithdrawRequest, Order, ProOrder, AuditLog } = require('../models');

const PENDING_DAYS = 7;

async function ghiAuditLog(actor, action, targetType, targetId, oldValue, newValue, reason) {
  try {
    await AuditLog.create({
      actor: actor || 'admin',
      action,
      targetType: targetType || '',
      targetId: targetId != null ? String(targetId) : '',
      oldValue: oldValue != null ? String(oldValue) : '',
      newValue: newValue != null ? String(newValue) : '',
      reason: reason || '',
    });
  } catch (err) {
    console.error('[commissionService] lỗi ghi audit log:', err.message);
  }
}

async function getRates() {
  const [l1, l2, l3] = await Promise.all([
    Setting.findByPk('commissionL1Percent'),
    Setting.findByPk('commissionL2Percent'),
    Setting.findByPk('commissionL3Percent'),
  ]);
  return {
    l1Percent: Number(l1 ? l1.value : process.env.COMMISSION_L1_PERCENT || 10),
    l2Percent: Number(l2 ? l2.value : process.env.COMMISSION_L2_PERCENT || 5),
    l3Percent: Number(l3 ? l3.value : process.env.COMMISSION_L3_PERCENT || 2),
  };
}

async function setRates({ l1Percent, l2Percent, l3Percent }, boi) {
  const truoc = await getRates();
  await Promise.all([
    Setting.upsert({ key: 'commissionL1Percent', value: String(l1Percent) }),
    Setting.upsert({ key: 'commissionL2Percent', value: String(l2Percent) }),
    Setting.upsert({ key: 'commissionL3Percent', value: String(l3Percent) }),
  ]);
  await ghiAuditLog(
    boi,
    'change_commission_rate',
    'Setting',
    'commission',
    `L1=${truoc.l1Percent}% L2=${truoc.l2Percent}% L3=${truoc.l3Percent}%`,
    `L1=${l1Percent}% L2=${l2Percent}% L3=${l3Percent}%`
  );
}

/**
 * Ghi 1 dòng hoa hồng ở trạng thái PENDING (chưa cộng ví) — dùng chung mã
 * "COM-{relatedType}-{relatedId}-{cap}" làm khóa CHỐNG CỘNG TRÙNG:
 * WalletTransaction.code có ràng buộc UNIQUE sẵn, nên nếu hàm này lỡ bị gọi
 * 2 lần cho cùng 1 đơn hàng, lần thứ 2 sẽ vỡ unique constraint và bị bỏ qua
 * an toàn — không cần thêm bảng khóa riêng.
 */
async function ghiHoaHongCho(recipient, amount, cap, relatedType, relatedId, moTa) {
  if (amount <= 0) return null;
  const code = `COM-${relatedType}-${relatedId}-${cap}`.toUpperCase();
  const loaiGiaoDich = { L1: 'commission_l1', L2: 'commission_l2', L3: 'commission_l3' }[cap];
  try {
    return await WalletTransaction.create({
      code,
      type: loaiGiaoDich,
      amount,
      status: 'pending', // Ledger: CHƯA cộng vào walletBalance — xem duyetHoaHongDaHan.
      description: moTa,
      relatedType,
      relatedId,
      UserId: recipient.id,
    });
  } catch (err) {
    // Unique constraint trên `code` = đã ghi cho đơn này rồi, bỏ qua êm.
    if (err.name === 'SequelizeUniqueConstraintError') return null;
    throw err;
  }
}

/**
 * @param {User} buyer Người vừa mua hàng qua link giới thiệu (khách của C).
 * @param {number} amount Giá trị đơn hàng để tính % hoa hồng trên đó.
 * @param {string} relatedType 'Tool' | 'Course' | 'Pro'
 * @param {number} relatedId id của Tool/Course/ProOrder tương ứng.
 */
async function distributeCommission(buyer, amount, relatedType, relatedId) {
  if (!buyer.parentId || !amount) return;
  const rates = await getRates();
  const tenSanPham = relatedType === 'Course' ? 'khóa học' : relatedType === 'Tool' ? 'tool' : 'gói Pro';

  const c = await User.findByPk(buyer.parentId); // người giới thiệu trực tiếp (Cấp 1)
  if (!c) return;
  await ghiHoaHongCho(
    c,
    Math.round((amount * rates.l1Percent) / 100),
    'L1',
    relatedType,
    relatedId,
    `Hoa hồng Cấp 1 (${rates.l1Percent}%) từ ${buyer.name} mua ${tenSanPham}`
  );

  if (!c.parentId) return;
  const b = await User.findByPk(c.parentId); // Cấp 2
  if (!b) return;
  await ghiHoaHongCho(
    b,
    Math.round((amount * rates.l2Percent) / 100),
    'L2',
    relatedType,
    relatedId,
    `Hoa hồng Cấp 2 (${rates.l2Percent}%) từ ${buyer.name} (qua ${c.name})`
  );

  if (!b.parentId) return;
  const a = await User.findByPk(b.parentId); // Cấp 3
  if (!a) return;
  await ghiHoaHongCho(
    a,
    Math.round((amount * rates.l3Percent) / 100),
    'L3',
    relatedType,
    relatedId,
    `Hoa hồng Cấp 3 (${rates.l3Percent}%) từ ${buyer.name} (qua ${b.name})`
  );
}

/**
 * Chạy định kỳ (xem server.js) — mọi hoa hồng đã "chờ" đủ PENDING_DAYS ngày
 * thì tự chuyển 'paid' và CỘNG vào walletBalance lúc này (không cộng lúc
 * phát sinh — xem ghi chú Ledger ở đầu file).
 */
async function duyetHoaHongDaHan() {
  const hanChot = new Date(Date.now() - PENDING_DAYS * 24 * 60 * 60 * 1000);
  const dsChoDuyet = await WalletTransaction.findAll({
    where: {
      type: { [Op.in]: ['commission_l1', 'commission_l2', 'commission_l3'] },
      status: 'pending',
      createdAt: { [Op.lte]: hanChot },
    },
  });
  for (const tx of dsChoDuyet) {
    await duyetMotHoaHong(tx, 'he-thong-tu-dong');
  }
  return dsChoDuyet.length;
}

async function duyetMotHoaHong(tx, boi) {
  const user = await User.findByPk(tx.UserId);
  if (!user) return;
  const balanceAfter = (user.walletBalance || 0) + tx.amount;
  await user.update({ walletBalance: balanceAfter });
  await tx.update({ status: 'paid', balanceAfter, paidAt: new Date(), confirmedBy: boi });
}

/** Admin duyệt SỚM 1 dòng hoa hồng cụ thể (chưa đủ 7 ngày) — có audit log. */
async function duyetHoaHongSom(walletTransactionId, boi) {
  const tx = await WalletTransaction.findByPk(walletTransactionId);
  if (!tx || tx.status !== 'pending') return tx;
  await duyetMotHoaHong(tx, boi);
  await ghiAuditLog(boi, 'approve_commission_early', 'WalletTransaction', tx.id, 'pending', 'paid');
  return tx;
}

/** Admin duyệt yêu cầu rút tiền — trừ ví + ghi 1 WalletTransaction (idempotent theo status). */
async function duyetRutTien(withdrawRequestId, boi) {
  const req_ = await WithdrawRequest.findByPk(withdrawRequestId);
  if (!req_ || req_.status !== 'pending') return req_;

  const user = await User.findByPk(req_.UserId);
  if (!user) throw new Error('Không tìm thấy người rút tiền.');
  if ((user.walletBalance || 0) < req_.amount) throw new Error('Số dư ví không đủ tại thời điểm duyệt.');

  const balanceAfter = user.walletBalance - req_.amount;
  await user.update({ walletBalance: balanceAfter });
  await WalletTransaction.create({
    type: 'withdraw',
    amount: -req_.amount,
    status: 'paid',
    balanceAfter,
    description: `Rút hoa hồng về ${req_.bankName} - ${req_.bankAccount}`,
    paidAt: new Date(),
    UserId: user.id,
  });
  await req_.update({ status: 'approved', approvedBy: boi, approvedAt: new Date() });
  await ghiAuditLog(boi, 'approve_withdraw', 'WithdrawRequest', req_.id, '', `${req_.amount}đ`);
  return req_;
}

async function tuChoiRutTien(withdrawRequestId, boi, note) {
  const req_ = await WithdrawRequest.findByPk(withdrawRequestId);
  if (!req_ || req_.status !== 'pending') return req_;
  await req_.update({ status: 'rejected', approvedBy: boi, approvedAt: new Date(), note: note || '' });
  await ghiAuditLog(boi, 'reject_withdraw', 'WithdrawRequest', req_.id, '', `${req_.amount}đ`, note);
  return req_;
}

/**
 * Báo cáo tài chính tổng cho Admin — đúng 4 số theo mục 12 của đặc tả:
 *   - tongThuNhap: doanh thu toàn web (khóa học + tool + gói Pro, đã PAID).
 *   - hoaHongChoDuyet: đang trong 7 ngày chờ (status='pending').
 *   - hoaHongDaDuyet: đã qua 7 ngày, khả dụng nhưng CHƯA rút.
 *   - hoaHongDaChiTra: đã duyệt rút về ngân hàng.
 */
async function baoCaoTaiChinh() {
  const [doanhThuKhoaHoc, doanhThuPro, doanhThuTool, hoaHongChoDuyet, tongHoaHongDaDuyetTatCa, tongDaRut] =
    await Promise.all([
      Order.sum('amount', { where: { status: 'paid' } }),
      ProOrder.sum('amount', { where: { status: 'paid' } }),
      WalletTransaction.sum('amount', { where: { type: 'purchase', relatedType: 'Tool' } }),
      WalletTransaction.sum('amount', {
        where: { type: { [Op.in]: ['commission_l1', 'commission_l2', 'commission_l3'] }, status: 'pending' },
      }),
      WalletTransaction.sum('amount', {
        where: { type: { [Op.in]: ['commission_l1', 'commission_l2', 'commission_l3'] }, status: 'paid' },
      }),
      WalletTransaction.sum('amount', { where: { type: 'withdraw' } }),
    ]);

  const tongThuNhap = (doanhThuKhoaHoc || 0) + (doanhThuPro || 0) + Math.abs(doanhThuTool || 0);
  const hoaHongDaChiTra = Math.abs(tongDaRut || 0);
  const hoaHongDaDuyet = (tongHoaHongDaDuyetTatCa || 0) - hoaHongDaChiTra;

  return {
    tongThuNhap,
    hoaHongChoDuyet: hoaHongChoDuyet || 0,
    hoaHongDaDuyet,
    hoaHongDaChiTra,
  };
}

/** Tổng doanh thu PAID (khóa học + tool + Pro) của đúng nhóm buyerIds cho trước. */
async function doanhThuCuaNhomNguoiMua(buyerIds) {
  if (!buyerIds.length) return 0;
  const [khoaHoc, pro, tool] = await Promise.all([
    Order.sum('amount', { where: { status: 'paid', UserId: { [Op.in]: buyerIds } } }),
    ProOrder.sum('amount', { where: { status: 'paid', UserId: { [Op.in]: buyerIds } } }),
    WalletTransaction.sum('amount', {
      where: { type: 'purchase', relatedType: 'Tool', UserId: { [Op.in]: buyerIds } },
    }),
  ]);
  return (khoaHoc || 0) + (pro || 0) + Math.abs(tool || 0);
}

async function demSoDonHang(buyerIds) {
  if (!buyerIds.length) return 0;
  const [khoaHoc, pro, tool] = await Promise.all([
    Order.count({ where: { status: 'paid', UserId: { [Op.in]: buyerIds } } }),
    ProOrder.count({ where: { status: 'paid', UserId: { [Op.in]: buyerIds } } }),
    WalletTransaction.count({ where: { type: 'purchase', relatedType: 'Tool', UserId: { [Op.in]: buyerIds } } }),
  ]);
  return khoaHoc + pro + tool;
}

/**
 * Dashboard chi tiết 1 thành viên khi Admin click vào node trên Mindmap
 * (mục 8 của đặc tả) — doanh thu trực tiếp/từ cấp B/từ cấp C, hoa hồng theo
 * trạng thái, số dư ví, tổng khách hàng, tổng đơn hàng.
 */
async function chiTietThanhVien(memberId) {
  const capF1 = await User.findAll({ where: { parentId: memberId }, attributes: ['id'] });
  const idsF1 = capF1.map((u) => u.id);
  const capF2 = idsF1.length ? await User.findAll({ where: { parentId: { [Op.in]: idsF1 } }, attributes: ['id'] }) : [];
  const idsF2 = capF2.map((u) => u.id);
  const capF3 = idsF2.length ? await User.findAll({ where: { parentId: { [Op.in]: idsF2 } }, attributes: ['id'] }) : [];
  const idsF3 = capF3.map((u) => u.id);

  const [doanhThuTrucTiep, doanhThuCapB, doanhThuCapC, tongHoaHongCho, tongHoaHongDaDuyet, tongDaRut, tongDonHang] =
    await Promise.all([
      doanhThuCuaNhomNguoiMua(idsF1),
      doanhThuCuaNhomNguoiMua(idsF2),
      doanhThuCuaNhomNguoiMua(idsF3),
      WalletTransaction.sum('amount', {
        where: { UserId: memberId, type: { [Op.in]: ['commission_l1', 'commission_l2', 'commission_l3'] }, status: 'pending' },
      }),
      WalletTransaction.sum('amount', {
        where: { UserId: memberId, type: { [Op.in]: ['commission_l1', 'commission_l2', 'commission_l3'] }, status: 'paid' },
      }),
      WalletTransaction.sum('amount', { where: { UserId: memberId, type: 'withdraw' } }),
      demSoDonHang(idsF1),
    ]);

  const hoaHongDaChiTra = Math.abs(tongDaRut || 0);
  return {
    doanhThuTrucTiep,
    doanhThuCapB,
    doanhThuCapC,
    tongDoanhThuMang: doanhThuTrucTiep + doanhThuCapB + doanhThuCapC,
    hoaHongChoDuyet: tongHoaHongCho || 0,
    hoaHongDaDuyet: (tongHoaHongDaDuyet || 0) - hoaHongDaChiTra,
    hoaHongDaChiTra,
    tongHoaHong: (tongHoaHongCho || 0) + (tongHoaHongDaDuyet || 0),
    tongKhachHangTrucTiep: idsF1.length,
    tongDonHang,
  };
}

module.exports = {
  getRates,
  setRates,
  distributeCommission,
  duyetHoaHongDaHan,
  duyetHoaHongSom,
  duyetRutTien,
  tuChoiRutTien,
  baoCaoTaiChinh,
  chiTietThanhVien,
  PENDING_DAYS,
};
