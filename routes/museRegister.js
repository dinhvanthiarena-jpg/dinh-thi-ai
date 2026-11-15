// Trang công khai: khách đăng ký mua tool Sa Muse Ai (mount ở /dang-ky-tool-muse).
const express = require('express');
const rateLimit = require('express-rate-limit');
const svc = require('../services/museRegistrationService');

const router = express.Router();
const limiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 8, standardHeaders: true, legacyHeaders: false });

const TITLE = 'Đăng ký mua tool Sa Muse Ai — làm video AI hàng loạt';

const view = (res, extra) =>
  res.render('muse-register', { title: TITLE, gia: svc.GIA, ngay: svc.NGAY, zalo: svc.ZALO, old: {}, errors: [], done: null, pay: null, ...extra });

router.get('/', (req, res) => view(res, {}));

router.post('/', limiter, async (req, res) => {
  // Ô bẫy chống bot: người thật không thấy nên không điền.
  if (req.body.website) return view(res, {});
  if (!req.body.hieu) {
    return res.status(400).render('muse-register', {
      title: TITLE, gia: svc.GIA, ngay: svc.NGAY, zalo: svc.ZALO, old: req.body, done: null, pay: null,
      errors: [{ msg: 'Vui lòng tick xác nhận bạn đã đọc và hiểu các yêu cầu.' }],
    });
  }
  try {
    const r = await svc.dangKy(req.body);
    if (r.loi) {
      return res.status(400).render('muse-register', {
        title: TITLE, gia: svc.GIA, ngay: svc.NGAY, zalo: svc.ZALO, old: req.body, done: null, pay: null,
        errors: r.loi.map((msg) => ({ msg })),
      });
    }
    return view(res, { done: { code: r.reg.code, name: r.reg.name, email: r.reg.email }, pay: svc.thongTinThanhToan(r.reg) });
  } catch (e) {
    console.error('[museRegister]', e);
    return res.status(500).render('muse-register', {
      title: TITLE, gia: svc.GIA, ngay: svc.NGAY, zalo: svc.ZALO, old: req.body, done: null, pay: null,
      errors: [{ msg: `Có lỗi, vui lòng thử lại hoặc nhắn Zalo ${svc.ZALO}.` }],
    });
  }
});

module.exports = router;
