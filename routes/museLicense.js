// Endpoint công khai để tool desktop SA MUSE-AI xác thực key — xem ghi chú ở
// services/museLicenseService.js. Mount ở server.js: /api/muse-license
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const svc = require('../services/museLicenseService');

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // tool chỉ hỏi khi kích hoạt + mỗi 6h; 60 lần / 15 phút / IP là dư, chặn dò key hàng loạt
  standardHeaders: true,
  legacyHeaders: false,
  message: { valid: false, reason: 'too_many_requests' },
});

router.get('/verify', verifyLimiter, (req, res) => {
  const key = String(req.query.key || '').slice(0, 64);
  const machineId = String(req.query.machineId || '').slice(0, 40);
  const label = String(req.query.label || '').slice(0, 80);
  const version = String(req.query.v || '').slice(0, 20);
  res.json(svc.verify(key, machineId, { label, version }));
});

module.exports = router;
