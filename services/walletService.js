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
const telegram = require('./telegramService');

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

/** Ghi nhận nạp ví thành công — idempotent, gọi lại nhiều lần không cộng trùng. */
async function ghiNhanNapVi(tx, { bankRef = '', bankAmount = null, raw = '', boi = '' } = {}) {
  if (tx.status === 'paid') return tx;
  const user = await User.findByPk(tx.UserId);
  if (!user) throw new Error('Không tìm thấy người nạp của giao dịch này');

  const balanceAfter = soDu(user) + tx.amount;
  await user.update({ walletBalance: balanceAfter });
  await tx.update({
    status: 'paid',
    balanceAfter,
    paidAt: new Date(),
    bankRef,
    bankAmount,
    rawPayload: typeof raw === 'string' ? raw.slice(0, 4000) : JSON.stringify(raw).slice(0, 4000),
    confirmedBy: boi,
  });

  baoThay(
    `Đã cộng ${tx.amount.toLocaleString('vi-VN')}đ vào ví của ${user.name} (${user.email || user.phone || ''})\n` +
    `Giao dịch ${tx.code} — số dư mới ${balanceAfter.toLocaleString('vi-VN')}đ` +
    (boi === 'sepay' ? '' : ` — duyệt bởi ${boi || 'tay'}`)
  );
  return tx;
}

/** Mua 1 tool trả phí bằng số dư ví — trừ tiền, sinh license key, trả về cả hai. */
async function muaTool(user, tool) {
  if (!tool.price || tool.price <= 0) throw new Error('Tool này không phải trả phí.');
  const daMua = await ToolLicense.findOne({ where: { UserId: user.id, ToolId: tool.id } });
  if (daMua) return { transaction: null, license: daMua, daSoHuu: true };

  if (soDu(user) < tool.price) {
    throw new Error(`Số dư ví không đủ. Cần ${tool.price.toLocaleString('vi-VN')}đ, hiện có ${soDu(user).toLocaleString('vi-VN')}đ.`);
  }

  const balanceAfter = soDu(user) - tool.price;
  const tx = await WalletTransaction.create({
    type: 'purchase',
    amount: -tool.price,
    status: 'paid',
    balanceAfter,
    description: `Mua tool: ${tool.title}`,
    relatedType: 'Tool',
    relatedId: tool.id,
    paidAt: new Date(),
    UserId: user.id,
  });
  await user.update({ walletBalance: balanceAfter });

  let licenseKey = taoLicenseKey();
  for (let i = 0; i < 5 && (await ToolLicense.findOne({ where: { licenseKey } })); i += 1) licenseKey = taoLicenseKey();
  const license = await ToolLicense.create({
    licenseKey,
    UserId: user.id,
    ToolId: tool.id,
    WalletTransactionId: tx.id,
  });

  baoThay(`${user.name} vừa mua tool "${tool.title}" — ${tool.price.toLocaleString('vi-VN')}đ (trừ từ ví).`);
  return { transaction: tx, license, daSoHuu: false };
}

/** Đóng học phí 1 khóa học bằng số dư ví — trừ tiền, mở khóa học ngay. */
async function thanhToanHocPhiBangVi(user, course) {
  const alreadyEnrolled = await Enrollment.findOne({ where: { UserId: user.id, CourseId: course.id } });
  if (alreadyEnrolled) throw new Error('Bạn đã sở hữu khóa học này rồi.');

  const amount = course.salePrice != null ? course.salePrice : course.price;
  if (soDu(user) < amount) {
    throw new Error(`Số dư ví không đủ. Cần ${amount.toLocaleString('vi-VN')}đ, hiện có ${soDu(user).toLocaleString('vi-VN')}đ.`);
  }

  const order = await Order.create({
    UserId: user.id,
    CourseId: course.id,
    amount,
    provider: 'mock',
    status: 'paid',
    paidAt: new Date(),
    transactionRef: `VI-${Date.now().toString(36)}`,
  });
  const enrollment = await Enrollment.create({ UserId: user.id, CourseId: course.id, OrderId: order.id });
  await Course.increment('enrollmentCount', { by: 1, where: { id: course.id } });

  const balanceAfter = soDu(user) - amount;
  await WalletTransaction.create({
    type: 'purchase',
    amount: -amount,
    status: 'paid',
    balanceAfter,
    description: `Đóng học phí: ${course.title}`,
    relatedType: 'Course',
    relatedId: course.id,
    paidAt: new Date(),
    UserId: user.id,
  });
  await user.update({ walletBalance: balanceAfter });

  baoThay(`${user.name} vừa đóng học phí "${course.title}" — ${amount.toLocaleString('vi-VN')}đ (trừ từ ví).`);
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
