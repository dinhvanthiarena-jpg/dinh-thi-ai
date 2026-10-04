// Trang quản trị: đặt GIÁ BÁN key SA-BOTAI 30 ngày để khách tự mua bằng ví trong tool
// (thầy chưa chốt giá nên để chỉnh ở đây, không hard-code). Mount riêng ở server.js
// (/admin/gia-key-sa-botai) nên tự gắn đủ requireAuth + requireAdmin + layout admin.
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { WalletTransaction, User } = require('../models');
const fbaiKeyPricing = require('../services/fbaiKeyPricing');

router.use(requireAuth, requireAdmin);
router.use((req, res, next) => {
  res.locals.layout = 'layouts/admin';
  next();
});

router.get('/', async (req, res, next) => {
  try {
    const giaVnd = fbaiKeyPricing.getPriceVnd();
    const giaoDich = await WalletTransaction.findAll({
      where: { relatedType: 'FbaiKey' },
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 30,
    });
    res.render('admin/fbai-key-pricing', { title: 'Giá bán key SA-BOTAI', giaVnd, giaoDich, saved: req.query.saved === '1' });
  } catch (err) { next(err); }
});

router.post('/', (req, res) => {
  const raw = String(req.body.giaVnd || '').replace(/[^0-9]/g, '');
  fbaiKeyPricing.setPriceVnd(raw ? Number(raw) : null);
  res.redirect('/admin/gia-key-sa-botai?saved=1');
});

module.exports = router;
