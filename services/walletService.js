/**
 * Ví trên web — nạp tiền một lần bằng chuyển khoản VietQR, tiêu dần cho việc
 * mua tool trả phí hoặc đóng học phí khóa học, không phải quét mã mỗi lần
 * mua một món nhỏ.
 *
 * Cách tiền về — giống hệt cơ chế gói Pro (proService.js) đã chạy ổn:
 *   1. Người dùng chọn số tiền muốn nạp, hệ thống tạo 1 giao dịch với mã
 *      riêng, ví dụ VIF3K9QZ.
 *   2. Trang hiện mã QR VietQR đã nhúng sẵn số tiền và mã trong nội dung
 *      chuyển khoản.
 *   3. Tiền vào THẲNG tài khoản của thầy. SePay đọc được biến động số dư rồi
 *      gọi webhook (dùng CHUNG endpoint /pro/webhook/sepay với gói Pro, xem
 *      routes/pro.js — chỉ khác tiền tố mã: MONL... là gói Pro, VI... là nạp
 *      ví, để không phải cấu hình thêm webhook thứ hai bên SePay).
 *
 * Dùng chung các biến môi trường BANK_ID/BANK_ACCOUNT/BANK_ACCOUNT_NAME/
 * SEPAY_WEBHOOK_KEY với gói Pro — cùng 1 tài khoản ngân hàng nhận tiền.
 */
const { WalletTransaction, ToolLicense, Tool, User, Order, Course, Enrollment } = require('../models');
const { sequelize } = require('../config/db');
const telegram = require('./telegramService');
const commission = require('./commissionService');

/** Mã ngắn, dễ đọc, không có ký tự dễ nhìn nhầm (0/O, 1/I) — giống proService. */
function chuoiNgau(n) {
  const CHU = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < n; i += 1) s += CHU[Math.floor(Math.random() * CHU.length)];
  return s;
}
const taoMaNap = () => `VI${chuoiNgau(6)}`;
const taoLicenseKey = () => `TOOL-${chuoiNgau(4)}-${chuoiNgau(4)}-${chuoiNgau(4)}`;

const tuDongDoiSoat = () => Boolean(process.env.SEPAY_WEBHOOK_KEY);
function sanSangNhanTien() {
  return Boolean(process.env.BANK_ID && process.env.BANK_ACCOUNT && process.env.BANK_ACCOUNT_NAME);
}

async function baoThay(text) {
  const chat = process.env.TELEGRAM_ADMIN_CHAT;
  if (!chat) return;
  try {
    await telegram.sendMessage(chat, text);
  } catch (err) {
    console.error('[walletService/telegram]', err.message);
  }
}

function anhQR(tx) {
  const bank = process.env.BANK_ID;
  const stk = process.env.BANK_ACCOUNT;
  const ten = process.env.BANK_ACCOUNT_NAME || '';
  if (!bank || !stk) return '';
  const q = new URLSearchParams({ amount: String(tx.amount), addInfo: tx.code, accountName: ten });
  return `https://img.vietqr.io/image/${bank}-${stk}-compact2.png?${q.toString()}`;
}

function thongTinChuyenKhoan(tx) {
  return {
    nganHang: process.env.BANK_NAME || process.env.BANK_ID || '',
    soTaiKhoan: process.env.BANK_ACCOUNT || '',
    chuTaiKhoan: process.env.BANK_ACCOUNT_NAME || '',
    soTien: tx.amount,
    noiDung: tx.code,
  };
}

function soDu(user) {
  return (user && user.walletBalance) || 0;
}

/** Tạo giao dịch nạp ví — CHƯA cộng tiền, chỉ cộng khi có xác nhận đã trả. */
async function taoDonNapVi(userId, amount) {
  const soTien = Number(amount);
  if (!Number.isInteger(soTien) || soTien < 10000) {
    throw new Error('Số tiền nạp tối thiểu 10.000đ.');
  }
  let code = taoMaNap();
  for (let i = 0; i < 5 && (await WalletTransaction.findOne({ where: { code } })); i += 1) code = taoMaNap();

  const tx = await WalletTransaction.create({
    code,
    type: 'topup',
    amount: soTien,
    status: 'pending',
    description: 'Nạp tiền vào ví',
    UserId: userId,
  });

  const user = await User.findByPk(userId);
  baoThay(
    `Có người tạo lệnh nạp ví ${soTien.toLocaleString('vi-VN')}đ\n` +
    `Người nạp: ${user ? user.name + ' (' + (user.email || user.phone || '') + ')' : '#' + userId}\n` +
    `Nội dung chuyển khoản: ${code}\n` +
    (tuDongDoiSoat()
      ? 'Tiền về là hệ thống tự cộng vào ví.'
      : 'Chưa nối SePay — xem tiền về thì vào 3dvietpro.com/admin/wallet bấm duyệt.')
  );
  return tx;
}

/**
 * Ghi nhận nạp ví thành công — idempotent, gọi lại nhiều lần không cộng
 * trùng. Khoá cả 2 dòng (giao dịch + user) trong 1 transaction DB thật —
 * webhook SePay có thể gọi lại (retry) đúng lúc admin cũng đang bấm duyệt
 * tay, nếu không khoá thì cả 2 đường đều đọc thấy status='pending' cùng
 * lúc và CỘNG TIỀN 2 LẦN trước khi dòng nào kịp ghi 'paid' xong.
 */
async function ghiNhanNapVi(tx, { bankRef = '', bankAmount = null, raw = '', boi = '' } = {}) {
  return sequelize.transaction(async (t) => {
    const txKhoa = await WalletTransaction.findByPk(tx.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!txKhoa || txKhoa.status === 'paid') return txKhoa || tx;
    const user = await User.findByPk(txKhoa.UserId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) throw new Error('Không tìm thấy người nạp của giao dịch này');

    const balanceAfter = soDu(user) + txKhoa.amount;
    await user.update({ walletBalance: balanceAfter }, { transaction: t });
    await txKhoa.update(
      {
        status: 'paid',
        balanceAfter,
        paidAt: new Date(),
        bankRef,
        bankAmount,
        rawPayload: typeof raw === 'string' ? raw.slice(0, 4000) : JSON.stringify(raw).slice(0, 4000),
        confirmedBy: boi,
      },
      { transaction: t }
    );

    baoThay(
      `Đã cộng ${txKhoa.amount.toLocaleString('vi-VN')}đ vào ví của ${user.name} (${user.email || user.phone || ''})\n` +
      `Giao dịch ${txKhoa.code} — số dư mới ${balanceAfter.toLocaleString('vi-VN')}đ` +
      (boi === 'sepay' ? '' : ` — duyệt bởi ${boi || 'tay'}`)
    );
    return txKhoa;
  });
}

/**
 * Mua 1 tool trả phí bằng số dư ví — trừ tiền, sinh license key, trả về cả
 * hai. Khoá dòng user trong transaction + kiểm tra lại số dư/đã-mua-chưa
 * NGAY TRONG transaction đó — bấm mua 2 lần liền tay (double-click) không
 * thể trừ tiền 2 lần trước khi lần đầu kịp ghi xong.
 */
async function muaTool(user, tool) {
  if (!tool.price || tool.price <= 0) throw new Error('Tool này không phải trả phí.');
  const daMuaTruoc = await ToolLicense.findOne({ where: { UserId: user.id, ToolId: tool.id } });
  if (daMuaTruoc) return { transaction: null, license: daMuaTruoc, daSoHuu: true };

  const ketQua = await sequelize.transaction(async (t) => {
    const userKhoa = await User.findByPk(user.id, { transaction: t, lock: t.LOCK.UPDATE });
    const daMua = await ToolLicense.findOne({ where: { UserId: user.id, ToolId: tool.id }, transaction: t });
    if (daMua) return { transaction: null, license: daMua, daSoHuu: true };

    if (soDu(userKhoa) < tool.price) {
      throw new Error(`Số dư ví không đủ. Cần ${tool.price.toLocaleString('vi-VN')}đ, hiện có ${soDu(userKhoa).toLocaleString('vi-VN')}đ.`);
    }

    const balanceAfter = soDu(userKhoa) - tool.price;
    const tx = await WalletTransaction.create(
      {
        type: 'purchase',
        amount: -tool.price,
        status: 'paid',
        balanceAfter,
        description: `Mua tool: ${tool.title}`,
        relatedType: 'Tool',
        relatedId: tool.id,
        paidAt: new Date(),
        UserId: user.id,
      },
      { transaction: t }
    );
    await userKhoa.update({ walletBalance: balanceAfter }, { transaction: t });

    let licenseKey = taoLicenseKey();
    for (let i = 0; i < 5 && (await ToolLicense.findOne({ where: { licenseKey }, transaction: t })); i += 1) licenseKey = taoLicenseKey();
    const license = await ToolLicense.create(
      { licenseKey, UserId: user.id, ToolId: tool.id, WalletTransactionId: tx.id },
      { transaction: t }
    );

    return { transaction: tx, license, daSoHuu: false };
  });

  if (!ketQua.daSoHuu) {
    baoThay(`${user.name} vừa mua tool "${tool.title}" — ${tool.price.toLocaleString('vi-VN')}đ (trừ từ ví).`);
    await commission.distributeCommission(user, tool.price, 'Tool', tool.id);
  }
  return ketQua;
}

/**
 * Đóng học phí 1 khóa học bằng số dư ví — trừ tiền, mở khóa học ngay. Khoá
 * dòng user + kiểm tra lại "đã ghi danh chưa"/"đủ tiền chưa" NGAY TRONG
 * transaction, cùng lý do với muaTool() ở trên.
 */
async function thanhToanHocPhiBangVi(user, course) {
  const daGhiDanhTruoc = await Enrollment.findOne({ where: { UserId: user.id, CourseId: course.id } });
  if (daGhiDanhTruoc) throw new Error('Bạn đã sở hữu khóa học này rồi.');

  const amount = course.salePrice != null ? course.salePrice : course.price;

  const { order, enrollment } = await sequelize.transaction(async (t) => {
    const userKhoa = await User.findByPk(user.id, { transaction: t, lock: t.LOCK.UPDATE });
    const alreadyEnrolled = await Enrollment.findOne({ where: { UserId: user.id, CourseId: course.id }, transaction: t });
    if (alreadyEnrolled) throw new Error('Bạn đã sở hữu khóa học này rồi.');

    if (soDu(userKhoa) < amount) {
      throw new Error(`Số dư ví không đủ. Cần ${amount.toLocaleString('vi-VN')}đ, hiện có ${soDu(userKhoa).toLocaleString('vi-VN')}đ.`);
    }

    const order_ = await Order.create(
      {
        UserId: user.id,
        CourseId: course.id,
        amount,
        provider: 'mock',
        status: 'paid',
        paidAt: new Date(),
        transactionRef: `VI-${Date.now().toString(36)}`,
      },
      { transaction: t }
    );
    const enrollment_ = await Enrollment.create({ UserId: user.id, CourseId: course.id, OrderId: order_.id }, { transaction: t });
    await Course.increment('enrollmentCount', { by: 1, where: { id: course.id }, transaction: t });

    const balanceAfter = soDu(userKhoa) - amount;
    await WalletTransaction.create(
      {
        type: 'purchase',
        amount: -amount,
        status: 'paid',
        balanceAfter,
        description: `Đóng học phí: ${course.title}`,
        relatedType: 'Course',
        relatedId: course.id,
        paidAt: new Date(),
        UserId: user.id,
      },
      { transaction: t }
    );
    await userKhoa.update({ walletBalance: balanceAfter }, { transaction: t });

    return { order: order_, enrollment: enrollment_ };
  });

  baoThay(`${user.name} vừa đóng học phí "${course.title}" — ${amount.toLocaleString('vi-VN')}đ (trừ từ ví).`);
  await commission.distributeCommission(user, amount, 'Course', course.id);
  return { order, enrollment };
}

module.exports = {
  tuDongDoiSoat,
  sanSangNhanTien,
  anhQR,
  thongTinChuyenKhoan,
  soDu,
  taoDonNapVi,
  ghiNhanNapVi,
  muaTool,
  thanhToanHocPhiBangVi,
};
