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

// Phân quyền cho module "Quản lý Mùn cưa & Củi" (/mun-cui), tách biệt với
// role của LMS. Site admin luôn có toàn quyền (tương đương 'owner'); ngoài
// ra thành viên được gán sawdustRole mới vào được module này.
const SAWDUST_RANK = { staff: 1, manager: 2, owner: 3 };

function sawdustLevel(user) {
  if (!user) return 0;
  if (user.role === 'admin') return SAWDUST_RANK.owner;
  return SAWDUST_RANK[user.sawdustRole] || 0;
}

function requireSawdustLevel(minLevel) {
  return function (req, res, next) {
    if (!req.user) {
      req.flash('error', 'Vui lòng đăng nhập để tiếp tục.');
      return res.redirect(`/auth/login?next=${encodeURIComponent(req.originalUrl)}`);
    }
    if (sawdustLevel(req.user) < minLevel) {
      req.flash('error', 'Bạn không có quyền truy cập khu vực này.');
      return res.redirect('/mun-cui');
    }
    next();
  };
}

const requireSawdustAccess = requireSawdustLevel(SAWDUST_RANK.staff);
const requireSawdustManager = requireSawdustLevel(SAWDUST_RANK.manager);
const requireSawdustOwner = requireSawdustLevel(SAWDUST_RANK.owner);

module.exports = {
  attachUser,
  requireAuth,
  requireAdmin,
  redirectIfAuthenticated,
  sawdustLevel,
  requireSawdustAccess,
  requireSawdustManager,
  requireSawdustOwner,
};
