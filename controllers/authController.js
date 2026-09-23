const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { getReferrerId } = require('../middleware/affiliateTracking');

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

exports.showRegister = (req, res) => {
  res.render('auth/register', {
    title: 'Đăng ký tài khoản',
    errors: [],
    old: {},
    agent: req.query.agent === '1',
    refCode: req.query.ref || '',
  });
};

// Mã giới thiệu có thể tới bằng 2 đường: (1) link có sẵn ?ref=... (tự điền
// qua cookie, xem middleware/affiliateTracking.js#getReferrerId), hoặc (2)
// khách chỉ được đọc/gửi riêng MÃ (không phải link) nên tự gõ vào ô "Mã
// giới thiệu" trên form — ưu tiên mã tự gõ vì đó là lựa chọn rõ ràng nhất
// của người dùng tại thời điểm đăng ký.
//
// ?agent=1 (từ dropdown "Đăng ký" trên header, mục "Đăng ký đại lý") giữ qua
// hidden input wantAgent trên form — gộp 2 bước "tạo tài khoản" + "đăng ký
// làm đại lý" thành 1 lần bấm cho gọn (yêu cầu 2026-09-23), thay vì bắt user
// tạo tài khoản xong phải tự vào /gioi-thieu-ban-be bấm đăng ký lần nữa.
exports.register = async (req, res) => {
  const wantAgent = req.body.wantAgent === '1';
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/register', {
      title: 'Đăng ký tài khoản',
      errors: errors.array(),
      old: req.body,
      agent: wantAgent,
      refCode: req.body.refCode || '',
    });
  }

  const { name, email, password } = req.body;
  const existing = await User.findOne({ where: { email: email.toLowerCase() } });
  if (existing) {
    return res.status(400).render('auth/register', {
      title: 'Đăng ký tài khoản',
      errors: [{ msg: 'Email này đã được sử dụng.' }],
      old: req.body,
      agent: wantAgent,
      refCode: req.body.refCode || '',
    });
  }

  const maGoTay = String(req.body.refCode || '').trim().toUpperCase();
  let parentId = null;
  if (maGoTay) {
    const nguoiGioiThieu = await User.findOne({ where: { refCode: maGoTay, agentStatus: 'approved' } });
    if (nguoiGioiThieu) parentId = nguoiGioiThieu.id;
  }
  if (!parentId) parentId = await getReferrerId(req);

  const user = await User.create({
    name,
    email,
    password,
    parentId,
    agentStatus: wantAgent ? 'pending' : 'none',
  });
  const token = signToken(user);
  setAuthCookie(res, token);

  if (wantAgent) {
    req.flash('success', `Chào mừng ${user.name}! Đã gửi đăng ký làm đại lý, vui lòng chờ admin duyệt.`);
    return res.redirect('/gioi-thieu-ban-be');
  }
  req.flash('success', `Chào mừng ${user.name} đã tham gia Đinh Thi Ai!`);
  res.redirect('/dashboard');
};

exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Đăng nhập', errors: [], old: {}, next: req.query.next || '' });
};

function safeRedirectPath(candidate) {
  // Only allow same-site, relative paths ("/dashboard") — reject
  // protocol-relative ("//evil.com") or absolute URLs that `startsWith('/')`
  // would otherwise let slip through as an open-redirect.
  if (typeof candidate !== 'string' || !candidate.startsWith('/') || candidate.startsWith('//')) {
    return '/dashboard';
  }
  return candidate;
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const nextUrl = safeRedirectPath(req.body.next);

  const user = await User.findOne({ where: { email: (email || '').toLowerCase() } });
  const valid = user && (await user.comparePassword(password));

  if (!valid) {
    return res.status(400).render('auth/login', {
      title: 'Đăng nhập',
      errors: [{ msg: 'Email hoặc mật khẩu không đúng.' }],
      old: { email },
      next: nextUrl,
    });
  }

  const token = signToken(user);
  setAuthCookie(res, token);
  req.flash('success', `Chào mừng trở lại, ${user.name}!`);
  res.redirect(nextUrl);
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  req.flash('success', 'Bạn đã đăng xuất.');
  res.redirect('/');
};
