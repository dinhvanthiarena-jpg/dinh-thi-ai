// Trang pháp lý SA-BOTAI công khai: Điều khoản dịch vụ (hợp đồng điện tử) + Chính sách bảo mật.
// Giá/thông tin Bên A lấy từ cấu hình (services/fbaiKeyPricing.js) nên luôn khớp bảng giá đang bán.
const express = require('express');
const router = express.Router();
const pricing = require('../services/fbaiKeyPricing');
const terms = require('../services/termsService');

function commonData() {
  return { version: terms.VERSION, legal: pricing.getLegal(), privacyUrl: terms.PRIVACY_URL, termsUrl: terms.TERMS_URL };
}

router.get('/dieu-khoan', (req, res) => {
  res.render('legal/dieu-khoan-sa-botai', {
    title: 'Điều khoản dịch vụ SA-BOTAI',
    ...commonData(),
    plans: pricing.getPlans().filter((p) => p.kind !== 'first'),
    firstOffer: pricing.getFirstOffer(),
    webFee: pricing.getWebFee(),
    usdRate: pricing.USD_RATE,
    firstKeyDays: pricing.FIRST_KEY_DAYS,
  });
});

router.get('/bao-mat', (req, res) => {
  res.render('legal/bao-mat-sa-botai', { title: 'Chính sách bảo mật SA-BOTAI', ...commonData() });
});

module.exports = router;
