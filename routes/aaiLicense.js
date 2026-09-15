// Endpoint công khai để BẤT KỲ bản clone nào của A-AI Ads (chạy trên web của
// khách hàng, xem thư mục aai-ads-module/) tự xác thực license key với server
// trung tâm này — đây là cách DUY NHẤT thầy thu hồi được quyền dùng tool sau
// khi đã cấp key (vì bản thân thuật toán checksum trong key vẫn luôn "đúng"
// về mặt toán học, không tự nhận biết được là đã bị thầy thu hồi trên
// aaiLicenseService — phải hỏi lại đây mới biết đúng trạng thái mới nhất).
// Không cần đăng nhập vì bên gọi là 1 server khác, không phải trình duyệt của
// thầy — nhưng cũng không lộ thông tin gì nhạy cảm ngoài true/false.
const express = require('express');
const router = express.Router();
const aaiLicenseService = require('../services/aaiLicenseService');

router.get('/verify', (req, res) => {
  const key = req.query.key || '';
  const valid = aaiLicenseService.isActiveLicense(key);
  res.json({ valid });
});

module.exports = router;
