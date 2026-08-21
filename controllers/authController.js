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
  res.render('auth/register', { title: 'Dang ky tai khoan', errors: [], old: {} });
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/register', {
      title: 'Dang ky tai khoan',
      errors: errors.array(),
      old: req.body,
    });
  }

  const { name, email, password } = req.body;
  const existing = await User.findOne({ where: { email: email.toLowerCase() } });
  if (existing) {
    return res.status(400).render('auth/register', {
      title: 'Dang ky tai khoan',
      errors: [{ msg: 'Email nay da duoc su dung.' }],
      old: req.body,
    });
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user);
  setAuthCookie(res, token);
  req.flash('success', `Chao mung ${user.name} da tham gia Dinh Thi Ai!`);
  res.redirect('/dashboard');
};

exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Dang nhap', errors: [], old: {}, next: req.query.next || '' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const nextUrl = req.body.next || '/dashboard';

  const user = await User.findOne({ where: { email: (email || '').toLowerCase() } });
  const valid = user && (await user.comparePassword(password));

  if (!valid) {
    return res.status(400).render('auth/login', {
      title: 'Dang nhap',
      errors: [{ msg: 'Email hoac mat khau khong dung.' }],
      old: { email },
      next: nextUrl,
    });
  }

  const token = signToken(user);
  setAuthCookie(res, token);
  req.flash('success', `Chao mung tro lai, ${user.name}!`);
  res.redirect(nextUrl.startsWith('/') ? nextUrl : '/dashboard');
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  req.flash('success', 'Ban da dang xuat.');
  res.redirect('/');
};
