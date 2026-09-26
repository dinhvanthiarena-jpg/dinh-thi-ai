// Trang công khai (không cần đăng nhập tài khoản web — khách desktop chỉ có
// license key FBAI-... làm định danh) để khách tự mua thêm slot Website cho
// tool SA-AI BOT. Xem services/fbaiWebUpgradeService.js cho toàn bộ logic.
const express = require('express');
const router = express.Router();
const fbaiLicenseService = require('../services/fbaiLicenseService');
const fbaiWebUpgrade = require('../services/fbaiWebUpgradeService');

function an(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error('[fbai-web-upgrade]', req.method, req.originalUrl, err);
      if (res.headersSent) return;
      res.status(500).send('<p style="font:16px system-ui;padding:2rem">Có lỗi ở máy chủ. <a href="javascript:history.back()">Quay lại</a></p>');
    });
  };
}

router.get('/', an((req, res) => {
  const key = fbaiLicenseService.normalizeAndFormat(String(req.query.key || ''));
  const wellFormed = fbaiLicenseService.isWellFormed(key);
  const active = wellFormed && fbaiLicenseService.isActiveLicense(key);
  res.render('fbai/nang-cap', {
    title: 'Nâng cấp gói Website — SA-AI BOT',
    key: req.query.key || '',
    wellFormed,
    active,
    currentLimit: active ? fbaiLicenseService.getWebsiteLimit(key) : null,
    pricePerWeb: fbaiWebUpgrade.PRICE_PER_WEB_PER_MONTH,
    sanSang: fbaiWebUpgrade.sanSangNhanTien(),
    loi: req.query.loi || '',
  });
}));

router.post('/mua', an((req, res) => {
  const key = String(req.body.key || '');
  const soWeb = parseInt(req.body.soWeb, 10);
  if (!fbaiWebUpgrade.sanSangNhanTien()) {
    return res.redirect(`/fbai-nang-cap?key=${encodeURIComponent(key)}&loi=${encodeURIComponent('Chưa cấu hình tài khoản nhận tiền.')}`);
  }
  try {
    const order = fbaiWebUpgrade.taoDon(key, soWeb);
    res.redirect(`/fbai-nang-cap/don/${order.code}`);
  } catch (e) {
    res.redirect(`/fbai-nang-cap?key=${encodeURIComponent(key)}&loi=${encodeURIComponent(e.message)}`);
  }
}));

router.get('/don/:code', an((req, res) => {
  const order = fbaiWebUpgrade.getOrder(req.params.code);
  if (!order) return res.redirect('/fbai-nang-cap');
  res.render('fbai/don', {
    title: 'Thanh toán nâng cấp gói Website',
    order,
    qr: fbaiWebUpgrade.anhQR(order),
    ck: fbaiWebUpgrade.thongTinChuyenKhoan(order),
  });
}));

router.get('/don/:code/trang-thai', an((req, res) => {
  const order = fbaiWebUpgrade.getOrder(req.params.code);
  if (!order) return res.status(404).json({});
  res.json({ status: order.status, newLimit: order.status === 'paid' ? fbaiLicenseService.getWebsiteLimit(order.licenseKey) : null });
}));

module.exports = router;
