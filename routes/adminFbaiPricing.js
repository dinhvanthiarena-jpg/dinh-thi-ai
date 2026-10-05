// Trang quản trị SA-BOTAI: bảng giá (phí tạo web, các gói gia hạn theo tháng), thông tin Bên A hiển thị trên
// Điều khoản dịch vụ, và xem lượt khách tự mua / web đã tạo / nhật ký đồng ý điều khoản. Mount riêng ở
// server.js (/admin/gia-key-sa-botai) nên tự gắn đủ requireAuth + requireAdmin + layout admin.
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { WalletTransaction, User, WebsiteDomain, TermsAcceptance } = require('../models');
const pricing = require('../services/fbaiKeyPricing');
const terms = require('../services/termsService');
const { Op } = require('sequelize');

router.use(requireAuth, requireAdmin);
router.use((req, res, next) => {
  res.locals.layout = 'layouts/admin';
  next();
});

router.get('/', async (req, res, next) => {
  try {
    const giaoDich = await WalletTransaction.findAll({
      where: { relatedType: { [Op.in]: ['FbaiKey', 'FbaiKeyPlan', 'WebsiteBuild'] }, status: 'paid' },
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 30,
    });
    const webs = await WebsiteDomain.findAll({ order: [['createdAt', 'DESC']], limit: 30 });
    const userMap = {};
    (await User.findAll({ where: { id: webs.map((w) => w.UserId) }, attributes: ['id', 'name', 'email'] })).forEach((u) => { userMap[u.id] = u; });
    const dongY = await TermsAcceptance.findAll({ order: [['acceptedAt', 'DESC']], limit: 20 });
    const dongYUsers = {};
    (await User.findAll({ where: { id: dongY.map((d) => d.UserId) }, attributes: ['id', 'name', 'email'] })).forEach((u) => { dongYUsers[u.id] = u; });
    res.render('admin/fbai-key-pricing', {
      title: 'Bảng giá & thanh toán SA-BOTAI',
      cfg: pricing.getConfig(),
      usdRate: pricing.USD_RATE,
      toVnd: pricing.toVnd,
      firstKeyDays: pricing.FIRST_KEY_DAYS,
      giaoDich, webs, userMap, dongY, dongYUsers,
      termsVersion: terms.VERSION,
      saved: req.query.saved === '1',
    });
  } catch (err) { next(err); }
});

router.post('/', (req, res) => {
  const b = req.body || {};
  const months = [].concat(b.months || []);
  const usds = [].concat(b.usd || []);
  const enabled = new Set([].concat(b.enabled || []).map(String));
  const plans = months.map((m, i) => ({ months: Number(m), usd: Number(String(usds[i] || '').replace(/[^0-9.]/g, '')), enabled: enabled.has(String(m)) }))
    .filter((p) => p.months >= 1 && p.usd > 0);
  pricing.saveConfig({
    webFeeUsd: Number(String(b.webFeeUsd || '').replace(/[^0-9.]/g, '')) || undefined,
    plans: plans.length ? plans : undefined,
    legal: { ten: String(b.ten || '').slice(0, 200), mst: String(b.mst || '').slice(0, 100), diaChi: String(b.diaChi || '').slice(0, 300), email: String(b.email || '').slice(0, 120) },
  });
  res.redirect('/admin/gia-key-sa-botai?saved=1');
});

module.exports = router;
