// Trang quản trị key SA MUSE-AI: cấp / thu hồi / gia hạn / đổi máy / đổi hạn mức tài khoản.
// Mount riêng ở server.js (/admin/key-muse) nên tự gắn đủ requireAuth + requireAdmin + layout admin.
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const svc = require('../services/museLicenseService');

router.use(requireAuth, requireAdmin);
router.use((req, res, next) => {
  res.locals.layout = 'layouts/admin';
  next();
});

const back = (res, msg) => res.redirect('/admin/key-muse' + (msg ? `?msg=${encodeURIComponent(msg)}` : ''));

router.get('/', (req, res) => {
  res.render('admin/muse-license-keys', {
    title: 'Key SA MUSE-AI',
    keys: svc.listKeys(),
    plans: svc.PLANS,
    msg: String(req.query.msg || '').slice(0, 200),
  });
});

router.post('/', (req, res) => {
  const machineId = svc.normalizeMachineId(req.body.machineId);
  if (machineId === null) return back(res, 'Mã máy sai định dạng, cần dạng MUSE-XXXX-XXXX-XXXX-XXXX');
  // Key bán cho khách mặc định 30 ngày; gõ 0 mới ra key không hết hạn.
  const raw = String(req.body.days === undefined ? '' : req.body.days).trim();
  const days = raw === '' ? 30 : Math.max(0, parseInt(raw, 10) || 0);
  const entry = svc.issueKey({ note: String(req.body.note || '').slice(0, 200), plan: req.body.plan, days, machineId });
  back(res, `Đã cấp key ${entry.key}`);
});
router.post('/:key/revoke', (req, res) => { svc.revokeKey(req.params.key); back(res); });
router.post('/:key/reactivate', (req, res) => { svc.reactivateKey(req.params.key); back(res); });
router.post('/:key/extend', (req, res) => {
  const days = Math.min(3650, Math.max(1, parseInt(req.body.days, 10) || 30));
  svc.extendKey(req.params.key, days);
  back(res);
});
router.post('/:key/unlimited', (req, res) => { svc.setUnlimited(req.params.key); back(res); });
router.post('/:key/reset-machine', (req, res) => { svc.resetMachine(req.params.key); back(res); });
router.post('/:key/machine', (req, res) => {
  const machineId = svc.normalizeMachineId(req.body.machineId);
  if (machineId === null) return back(res, 'Mã máy sai định dạng, cần dạng MUSE-XXXX-XXXX-XXXX-XXXX');
  svc.setMachine(req.params.key, machineId);
  back(res);
});
router.post('/:key/plan', (req, res) => { svc.setPlan(req.params.key, req.body.plan); back(res); });

module.exports = router;
