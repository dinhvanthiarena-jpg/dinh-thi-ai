/**
 * Gói Pro của app Mon.L — bán bằng VietQR, tự đối soát.
 *
 * Cách tiền về:
 *   1. Người học chọn gói, hệ thống tạo một đơn với mã riêng, ví dụ MONL7F3K.
 *   2. Trang hiện mã QR VietQR đã nhúng sẵn số tiền và mã đơn trong nội dung
 *      chuyển khoản. Người học mở app ngân hàng bất kỳ, quét, bấm xác nhận.
 *   3. Tiền vào THẲNG tài khoản của thầy. SePay (hoặc PayOS) đọc được biến động
 *      số dư rồi gọi webhook sang đây. Khớp mã trong nội dung là mở gói.
 *
 * Không ai phải nhập số thẻ ở bất cứ đâu, kể cả người mua.
 *
 * Số tài khoản nhận tiền nằm trong biến môi trường, KHÔNG ghi trong mã nguồn:
 *   BANK_ID            mã ngân hàng theo chuẩn VietQR, ví dụ "970422" (MB Bank)
 *   BANK_ACCOUNT       số tài khoản nhận tiền
 *   BANK_ACCOUNT_NAME  tên chủ tài khoản, viết hoa không dấu
 *   SEPAY_WEBHOOK_KEY  chuỗi bí mật SePay gửi kèm mỗi lần báo, để chặn người lạ
 *   PRO_MODE           "off" (mặc định) hoặc "on" — xem ghi chú bên dưới
 *
 * PRO_MODE = "off" nghĩa là mọi tính năng vẫn MIỄN PHÍ cho tất cả mọi người.
 * Trang bán gói vẫn chạy được để thầy thử, nhưng không ai bị chặn. Khi nào muốn
 * bắt đầu thu tiền thì đổi thành "on" trong bảng biến môi trường của cPanel.
 */

const { ProOrder, User } = require('../models');

const PLANS = {
  month: { months: 1, amount: 29000, ten: 'Pro 1 tháng' },
  year: { months: 12, amount: 249000, ten: 'Pro 1 năm' },
};

const proMode = () => (process.env.PRO_MODE || 'off').toLowerCase();
const dangThuPhi = () => proMode() === 'on';

/** Đã cấu hình đủ để nhận tiền chưa. */
function sanSangNhanTien() {
  return Boolean(process.env.BANK_ID && process.env.BANK_ACCOUNT && process.env.BANK_ACCOUNT_NAME);
}

/** Mã đơn ngắn, dễ đọc, không có ký tự dễ nhìn nhầm (0/O, 1/I). */
function taoMa() {
  const CHU = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i += 1) s += CHU[Math.floor(Math.random() * CHU.length)];
  return `MONL${s}`;
}

/** Ảnh QR do vietqr.io sinh, đã nhúng sẵn số tiền và nội dung chuyển khoản. */
function anhQR(order) {
  const bank = process.env.BANK_ID;
  const stk = process.env.BANK_ACCOUNT;
  const ten = process.env.BANK_ACCOUNT_NAME || '';
  if (!bank || !stk) return '';
  const q = new URLSearchParams({
    amount: String(order.amount),
    addInfo: order.code,
    accountName: ten,
  });
  return `https://img.vietqr.io/image/${bank}-${stk}-compact2.png?${q.toString()}`;
}

/** Thông tin để người mua tự chuyển khoản tay nếu không quét được QR. */
function thongTinChuyenKhoan(order) {
  return {
    nganHang: process.env.BANK_NAME || process.env.BANK_ID || '',
    soTaiKhoan: process.env.BANK_ACCOUNT || '',
    chuTaiKhoan: process.env.BANK_ACCOUNT_NAME || '',
    soTien: order.amount,
    noiDung: order.code,
  };
}

async function taoDon(userId, plan) {
  const goi = PLANS[plan];
  if (!goi) throw new Error('Gói không hợp lệ');
  // Mã trùng thì bốc lại, xác suất gần như không có nhưng cứ chắc.
  let code = taoMa();
  for (let i = 0; i < 5 && (await ProOrder.findOne({ where: { code } })); i += 1) code = taoMa();
  return ProOrder.create({
    code,
    plan,
    amount: goi.amount,
    months: goi.months,
    UserId: userId,
  });
}

/**
 * Ghi nhận một đơn đã trả tiền và cộng hạn dùng cho người học.
 * Cộng DỒN: đang còn hạn mà mua tiếp thì nối vào cuối, không bị mất ngày.
 */
async function ghiNhanDaTra(order, { bankRef = '', bankAmount = null, raw = '', boi = '' } = {}) {
  if (order.status === 'paid') return order;
  const user = await User.findByPk(order.UserId);
  if (!user) throw new Error('Không tìm thấy người mua của đơn này');

  const mocBatDau = user.proUntil && new Date(user.proUntil) > new Date()
    ? new Date(user.proUntil)
    : new Date();
  const hetHan = new Date(mocBatDau);
  hetHan.setMonth(hetHan.getMonth() + order.months);

  await user.update({ proUntil: hetHan });
  await order.update({
    status: 'paid',
    paidAt: new Date(),
    bankRef,
    bankAmount,
    rawPayload: typeof raw === 'string' ? raw.slice(0, 4000) : JSON.stringify(raw).slice(0, 4000),
    confirmedBy: boi,
  });
  return order;
}

/** Người này còn hạn Pro không. */
function conHanPro(user) {
  return Boolean(user && user.proUntil && new Date(user.proUntil) > new Date());
}

/**
 * Người này có được dùng tính năng trả phí không.
 * Khi PRO_MODE tắt thì AI CŨNG ĐƯỢC — đang để miễn phí cho mọi người.
 */
function duocDung(user) {
  return !dangThuPhi() || conHanPro(user);
}

module.exports = {
  PLANS,
  proMode,
  dangThuPhi,
  sanSangNhanTien,
  anhQR,
  thongTinChuyenKhoan,
  taoDon,
  ghiNhanDaTra,
  conHanPro,
  duocDung,
};
