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
  const { name, email, phone, password, refCode } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Thiếu tên, email hoặc mật khẩu.' });
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
  res.json({ ok: true, token: ketQua.token, email: ketQua.email });
}));

// Bước 2: xác nhận mã OTP -> tạo tài khoản thật + trả JWT đăng nhập luôn
router.post('/verify-otp', express.json(), an(async (req, res) => {
  const { token, code } = req.body || {};
  if (!token || !code) return res.status(400).json({ error: 'Thiếu mã xác nhận.' });
  const ketQua = await authOtp.xacNhanDangKy({ token, code });
  if (ketQua.loi) return res.status(400).json({ error: ketQua.loi });
  res.json({ ok: true, token: signToken(ketQua.user), user: publicUser(ketQua.user) });
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

module.exports = router;
module.exports.requireBearerAuth = requireBearerAuth;
