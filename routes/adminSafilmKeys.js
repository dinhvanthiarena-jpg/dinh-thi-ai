// Trang quản trị key SA FILM-AI: cấp / thu hồi / gia hạn / đổi thiết bị, bật-tắt chế độ miễn phí.
// Mount riêng ở server.js (/admin/key-sa-film-ai) nên tự gắn đủ requireAuth + requireAdmin + layout admin.
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const svc = require('../services/safilmLicenseService');

router.use(requireAuth, requireAdmin);
router.use((req, res, next) => {
  res.locals.layout = 'layouts/admin';
  next();
});

const back = (res) => res.redirect('/admin/key-sa-film-ai');

router.get('/', (req, res) => {
  res.render('admin/safilm-license-keys', {
    title: 'Key SA FILM-AI',
    keys: svc.listKeys(),
    settings: svc.getSettings(),
  });
});

router.post('/', (req, res) => {
  const plan = req.body.plan === 'pro' ? 'pro' : 'free';
  const days = Math.max(0, parseInt(req.body.days, 10) || 0);
  svc.issueKey({ note: String(req.body.note || '').slice(0, 200), plan, days });
  back(res);
});
router.post('/free-mode', (req, res) => { svc.setFreeMode(req.body.on === '1'); back(res); });
router.post('/:key/revoke', (req, res) => { svc.revokeKey(req.params.key); back(res); });
router.post('/:key/reactivate', (req, res) => { svc.reactivateKey(req.params.key); back(res); });
router.post('/:key/extend', (req, res) => { svc.extendKey(req.params.key, 30); back(res); });
router.post('/:key/reset-device', (req, res) => { svc.resetDevice(req.params.key); back(res); });
router.post('/:key/plan', (req, res) => { svc.setPlan(req.params.key, req.body.plan === 'pro' ? 'pro' : 'free'); back(res); });

module.exports = router;
