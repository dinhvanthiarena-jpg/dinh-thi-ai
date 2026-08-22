const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

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
  res.render('auth/register', { title: 'Đăng ký tài khoản', errors: [], old: {} });
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/register', {
      title: 'Đăng ký tài khoản',
      errors: errors.array(),
      old: req.body,
    });
  }

  const { name, email, password } = req.body;
  const existing = await User.findOne({ where: { email: email.toLowerCase() } });
  if (existing) {
    return res.status(400).render('auth/register', {
      title: 'Đăng ký tài khoản',
      errors: [{ msg: 'Email này đã được sử dụng.' }],
      old: req.body,
    });
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user);
  setAuthCookie(res, token);
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
