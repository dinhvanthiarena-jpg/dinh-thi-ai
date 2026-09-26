// Mua thêm "slot Website" (kèm 1 Fanpage + 1 Group/slot, enforce ở phía
// desktop tool) cho tool SA-AI BOT — thầy yêu cầu 2026-09-26: 200.000đ/web
// thêm/THÁNG (không phải 1 lần). Cố tình KHÔNG dùng WalletTransaction/User
// (đòi đăng nhập tài khoản 3dvietpro.com) — khách desktop chỉ có đúng 1 thứ
// định danh là license key FBAI-..., không nhất thiết có tài khoản web, nên
// làm 1 kho JSON riêng tự chứa, cùng phong cách với fbaiLicenseService.js.
//
// Luồng tiền: giống hệt gói Pro/nạp ví (VietQR + SePay webhook đọc nội dung
// chuyển khoản) — chỉ khác tiền tố mã (WEBAI...) để dùng CHUNG 1 endpoint
// webhook /pro/webhook/sepay, không phải khai báo thêm URL thứ hai bên SePay.
const fs = require('fs');
const path = require('path');
const fbaiLicenseService = require('./fbaiLicenseService');

const PRICE_PER_WEB_PER_MONTH = 200000;
const ORDERS_PATH = path.join(__dirname, '..', 'data', 'fbai-web-upgrade-orders.json');
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function loadOrders() {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_PATH, 'utf8'));
  } catch (e) {
    return [];
  }
}
function saveOrders(list) {
  fs.mkdirSync(path.dirname(ORDERS_PATH), { recursive: true });
  fs.writeFileSync(ORDERS_PATH, JSON.stringify(list, null, 2));
}

function taoMa() {
  let s = '';
  for (let i = 0; i < 6; i++) s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  return `WEBAI${s}`;
}

function sanSangNhanTien() {
  return Boolean(process.env.BANK_ID && process.env.BANK_ACCOUNT && process.env.BANK_ACCOUNT_NAME);
}

function anhQR(order) {
  const bank = process.env.BANK_ID;
  const stk = process.env.BANK_ACCOUNT;
  const ten = process.env.BANK_ACCOUNT_NAME || '';
  if (!bank || !stk) return '';
  const q = new URLSearchParams({ amount: String(order.amount), addInfo: order.code, accountName: ten });
  return `https://img.vietqr.io/image/${bank}-${stk}-compact2.png?${q.toString()}`;
}

function thongTinChuyenKhoan(order) {
  return {
    nganHang: process.env.BANK_NAME || process.env.BANK_ID || '',
    soTaiKhoan: process.env.BANK_ACCOUNT || '',
    chuTaiKhoan: process.env.BANK_ACCOUNT_NAME || '',
    soTien: order.amount,
    noiDung: order.code,
  };
}

/** Tạo đơn mua N web thêm cho 1 license key — CHƯA nâng hạn mức, chỉ khi có xác nhận trả tiền thật. */
function taoDon(licenseKeyInput, extraWebsInput) {
  if (!fbaiLicenseService.isWellFormed(licenseKeyInput)) {
    throw new Error('Mã license không đúng định dạng.');
  }
  const licenseKey = fbaiLicenseService.normalizeAndFormat(licenseKeyInput);
  if (!fbaiLicenseService.isActiveLicense(licenseKey)) {
    throw new Error('License key không tồn tại hoặc đã hết hạn/bị thu hồi — liên hệ để gia hạn trước.');
  }
  const extraWebs = Math.max(1, Math.min(50, parseInt(extraWebsInput, 10) || 0));
  const amount = extraWebs * PRICE_PER_WEB_PER_MONTH;

  const list = loadOrders();
  let code = taoMa();
  while (list.some((o) => o.code === code)) code = taoMa();

  const order = { code, licenseKey, extraWebs, amount, status: 'pending', createdAt: Date.now() };
  list.unshift(order);
  saveOrders(list);
  return order;
}

function getOrder(code) {
  return loadOrders().find((o) => o.code === code);
}

/** Gọi TỪ webhook SePay sau khi đã xác nhận đủ tiền — set lại hạn mức web + hạn 30 ngày. */
function confirmOrder(code, bankInfo) {
  const list = loadOrders();
  const order = list.find((o) => o.code === code);
  if (!order || order.status === 'paid') return order;
  order.status = 'paid';
  order.paidAt = Date.now();
  order.bankRef = (bankInfo && bankInfo.bankRef) || '';
  saveOrders(list);
  fbaiLicenseService.setExtraWebs(order.licenseKey, order.extraWebs);
  return order;
}

module.exports = {
  PRICE_PER_WEB_PER_MONTH,
  sanSangNhanTien,
  anhQR,
  thongTinChuyenKhoan,
  taoDon,
  getOrder,
  confirmOrder,
};
