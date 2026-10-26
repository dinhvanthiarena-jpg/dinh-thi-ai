// Endpoint công khai để tool desktop SA FILM-AI xác thực key / nhận key miễn phí — xem ghi chú ở
// services/safilmLicenseService.js. Mount ở server.js: /api/safilm-license
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const svc = require('../services/safilmLicenseService');

const claimLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10, // tối đa 10 lần xin key / giờ / IP — chặn spam cấp key hàng loạt
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'too_many_requests' },
});

// Cho phép Flow Tool (chạy trong iframe của Google, origin lạ/null) gọi xác thực key từ trình duyệt.
// Chỉ các endpoint công khai này, không kèm cookie nên mở '*' là an toàn.
router.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

router.get('/verify', (req, res) => {
  const key = String(req.query.key || '').slice(0, 64);
  const deviceId = String(req.query.deviceId || '').slice(0, 80);
  const label = String(req.query.label || '').slice(0, 80);
  res.json({ ...svc.checkAndBindDevice(key, deviceId, label), freeMode: svc.getSettings().freeMode });
});

router.post('/claim-free', claimLimiter, (req, res) => {
  const b = req.body || {};
  const r = svc.claimFreeKey({
    deviceId: String(b.deviceId || '').slice(0, 80),
    email: String(b.email || '').slice(0, 120),
    label: String(b.label || '').slice(0, 80),
  });
  if (r.error) return res.status(r.error === 'free_closed' || r.error === 'revoked' ? 403 : 400).json({ ok: false, error: r.error });
  res.json({ ok: true, key: r.key, reused: r.reused });
});

// Cho tool biết hiện còn đang miễn phí không (để hiện/ẩn nút "Nhận key miễn phí")
router.get('/status', (req, res) => res.json({ freeMode: svc.getSettings().freeMode }));

module.exports = router;
