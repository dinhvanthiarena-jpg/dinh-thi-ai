const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function attachUser(req, res, next) {
  const token = req.cookies?.token;
  res.locals.currentUser = null;

  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (user && user.isActive) {
      req.user = user;
      res.locals.currentUser = user;
    }
  } catch (err) {
    res.clearCookie('token');
  }

  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    req.flash('error', 'Vui lòng đăng nhập để tiếp tục.');
    return res.redirect(`/auth/login?next=${encodeURIComponent(req.originalUrl)}`);
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    req.flash('error', 'Bạn không có quyền truy cập trang này.');
    return res.redirect('/');
  }
  next();
}

function redirectIfAuthenticated(req, res, next) {
  if (req.user) return res.redirect('/dashboard');
  next();
}

module.exports = { attachUser, requireAuth, requireAdmin, redirectIfAuthenticated };
