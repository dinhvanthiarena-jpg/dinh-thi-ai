// API đăng ký/đăng nhập DÀNH RIÊNG cho tool desktop SA-AI BOT (fb-ads-manager)
// — trả JSON thuần, KHÔNG dùng session cookie như web (desktop không có
// cookie jar theo domain như trình duyệt) — mỗi lần gọi API sau này tool tự
// gửi kèm JWT trong header Authorization: Bearer <token>. Dùng LẠI toàn bộ
// authOtpService.js đã có sẵn (cùng 1 nguồn OTP với web), chỉ khác lớp vỏ
// JSON thay vì render EJS.
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authOtp = require('../services/authOtpService');
const terms = require('../services/termsService');
const contractSvc = require('../services/contractService');

// token phiên đăng ký -> thông tin đồng ý điều khoản lúc bấm Đăng ký (ghi vào nhật ký khi OTP xác nhận xong)
const choDongY = new Map();

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
}
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone || '', role: user.role, walletBalance: user.walletBalance || 0, refCode: user.refCode || '' };
}

function an(fn) {
  return function (req, res) {
    Promise.resolve(fn(req, res)).catch((err) => {
      console.error('[sa-ai-bot-auth]', req.path, err);
      res.status(500).json({ error: 'Có lỗi ở máy chủ, thử lại sau.' });
    });
  };
}

// Bước 1: gửi OTP về email
router.post('/register', express.json(), an(async (req, res) => {
  const { name, email, phone, password, refCode, acceptTerms } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Thiếu tên, email hoặc mật khẩu.' });
  if (acceptTerms !== true) return res.status(400).json({ error: 'Bạn cần tích chọn đồng ý Điều khoản dịch vụ và Chính sách bảo mật để đăng ký.' });
  if (String(password).length < 6) return res.status(400).json({ error: 'Mật khẩu cần ít nhất 6 ký tự.' });
  // Mã giới thiệu (tuỳ chọn): của đại lý/người đã dùng tool — người này được hoa hồng khi khách mua key/tạo web.
  let parentId = null;
  const ma = String(refCode || '').trim().toUpperCase();
  if (ma) {
    const nguoiGioiThieu = await User.findOne({ where: { refCode: ma } });
    if (!nguoiGioiThieu) return res.status(400).json({ error: 'Mã giới thiệu không đúng — kiểm tra lại hoặc để trống.' });
    parentId = nguoiGioiThieu.id;
  }
  const ketQua = await authOtp.yeuCauDangKy({ name, email, phone, password, parentId });
  if (ketQua.loi) return res.status(400).json({ error: ketQua.loi });
  choDongY.set(ketQua.token, { ip: terms.layIp(req), ua: String(req.headers['user-agent'] || '').slice(0, 300), at: new Date() });
  setTimeout(() => choDongY.delete(ketQua.token), 30 * 60 * 1000).unref?.();
  res.json({ ok: true, token: ketQua.token, email: ketQua.email });
}));

// Bước 2: xác nhận mã OTP -> tạo tài khoản thật + trả JWT đăng nhập luôn
router.post('/verify-otp', express.json(), an(async (req, res) => {
  const { token, code } = req.body || {};
  if (!token || !code) return res.status(400).json({ error: 'Thiếu mã xác nhận.' });
  const ketQua = await authOtp.xacNhanDangKy({ token, code });
  if (ketQua.loi) return res.status(400).json({ error: ketQua.loi });
  // Ghi nhật ký đồng ý điều khoản đúng thời điểm/IP lúc khách bấm Đăng ký (bằng chứng pháp lý).
  const dongY = choDongY.get(token);
  choDongY.delete(token);
  const acc = await terms.ghiDongY(ketQua.user.id, req, 'register', dongY ? { ip: dongY.ip, ua: dongY.ua, at: dongY.at } : {});
  res.json({ ok: true, token: signToken(ketQua.user), user: publicUser(ketQua.user), termsOk: true, contractUrl: acc.contract ? contractSvc.urlHopDong(acc.contract) : '' });
}));

router.post('/resend-otp', express.json(), an(async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: 'Thiếu token phiên đăng ký.' });
  const ketQua = await authOtp.guiLai(token);
  if (ketQua.loi) return res.status(400).json({ error: ketQua.loi });
  res.json({ ok: true });
}));

// Đăng nhập bằng email + mật khẩu (tài khoản đã có sẵn, kể cả tạo từ web)
router.post('/login', express.json(), an(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Thiếu email hoặc mật khẩu.' });
  const user = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
  }
  res.json({ ok: true, token: signToken(user), user: publicUser(user) });
}));

// Quên mật khẩu — bước 1: gửi OTP
router.post('/forgot-password', express.json(), an(async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Thiếu email.' });
  const ketQua = await authOtp.yeuCauQuenMatKhau({ email });
  if (ketQua.loi) return res.status(400).json({ error: ketQua.loi });
  res.json({ ok: true, token: ketQua.token });
}));

router.post('/forgot-password/resend', express.json(), an(async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: 'Thiếu token.' });
  const ketQua = await authOtp.guiLaiQuenMatKhau(token);
  if (ketQua.loi) return res.status(400).json({ error: ketQua.loi });
  res.json({ ok: true });
}));

// Quên mật khẩu — bước 2: đúng mã + mật khẩu mới -> đổi thật, trả JWT đăng nhập luôn
router.post('/reset-password', express.json(), an(async (req, res) => {
  const { token, code, newPassword } = req.body || {};
  if (!token || !code || !newPassword) return res.status(400).json({ error: 'Thiếu thông tin.' });
  const ketQua = await authOtp.xacNhanQuenMatKhau({ token, code, newPassword });
  if (ketQua.loi) return res.status(400).json({ error: ketQua.loi });
  res.json({ ok: true, token: signToken(ketQua.user), user: publicUser(ketQua.user) });
}));

// Middleware xác thực Bearer JWT — dùng cho các API khác cần biết "ai đang gọi".
function requireBearerAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập.' });
  try {
    req.authUser = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn, đăng nhập lại nhé.' });
  }
}

// Tool tự gọi lúc mở app để xác nhận JWT đã lưu còn dùng được + lấy lại thông tin mới nhất.
router.get('/me', requireBearerAuth, an(async (req, res) => {
  const user = await User.findByPk(req.authUser.id);
  if (!user) return res.status(401).json({ error: 'Tài khoản không còn tồn tại.' });
  res.json({ ok: true, user: publicUser(user) });
}));

// ---- Điều khoản dịch vụ: phiên bản hiện hành, tình trạng đồng ý của tài khoản, ghi nhận đồng ý (cổng đăng nhập) ----
router.get('/terms', (req, res) => {
  res.json({ ok: true, version: terms.VERSION, termsUrl: terms.TERMS_URL, privacyUrl: terms.PRIVACY_URL });
});
router.get('/terms/status', requireBearerAuth, an(async (req, res) => {
  res.json({ ok: true, version: terms.VERSION, accepted: await terms.daDongY(req.authUser.id), termsUrl: terms.TERMS_URL, privacyUrl: terms.PRIVACY_URL });
}));
router.post('/terms/accept', express.json(), requireBearerAuth, an(async (req, res) => {
  if ((req.body || {}).accept !== true) return res.status(400).json({ error: 'Cần tích chọn đồng ý.' });
  let contract = null;
  if (!(await terms.daDongY(req.authUser.id))) contract = (await terms.ghiDongY(req.authUser.id, req, 'login-gate')).contract || null;
  if (!contract) contract = await contractSvc.hopDongMoiNhat(req.authUser.id);
  res.json({ ok: true, version: terms.VERSION, contractNo: contract ? contract.contractNo : '', contractUrl: contract ? contractSvc.urlHopDong(contract) : '' });
}));
// Link xem/in hợp đồng của chính khách (hợp đồng mới nhất).
router.get('/terms/contract', requireBearerAuth, an(async (req, res) => {
  const c = await contractSvc.hopDongMoiNhat(req.authUser.id);
  if (!c) return res.json({ ok: true, has: false });
  res.json({ ok: true, has: true, contractNo: c.contractNo, acceptedAt: c.acceptedAt, contractUrl: contractSvc.urlHopDong(c) });
}));

module.exports = router;
module.exports.requireBearerAuth = requireBearerAuth;
