// Endpoint công khai để tool desktop AAi-3dvietpro (fb-ads-manager) tự xác
// thực license key với server trung tâm này mỗi lần kích hoạt + định kỳ sau
// đó — xem ghi chú kiến trúc ở đầu services/fbaiLicenseService.js.
const express = require('express');
const router = express.Router();
const fbaiLicenseService = require('../services/fbaiLicenseService');

router.get('/verify', (req, res) => {
  const key = req.query.key || '';
  const valid = fbaiLicenseService.isActiveLicense(key);
  res.json({ valid });
});

module.exports = router;
