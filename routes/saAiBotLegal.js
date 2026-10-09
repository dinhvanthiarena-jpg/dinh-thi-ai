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

// Xem/in HỢP ĐỒNG ĐIỆN TỬ đã lưu của 1 khách — cần đúng mã ?t= (chỉ gửi cho chính khách qua tool/email). Hiển thị NGUYÊN VĂN đã lưu
// + dòng kiểm tra toàn vẹn (mã băm SHA-256 khớp = nội dung chưa bị sửa).
const contractSvc = require('../services/contractService');
router.get('/hop-dong/:no', async (req, res, next) => {
  try {
    const c = await contractSvc.theoSo(req.params.no);
    if (!c || !contractSvc.tokenHopLe(c, String(req.query.t || ''))) return res.status(404).send('Không tìm thấy hợp đồng hoặc đường dẫn không đúng.');
    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex');
    const footer = '<div style="max-width:48rem;margin:0 auto;padding:0 1rem 2rem;font:13px system-ui;color:#52525b"><hr><p>Mã kiểm tra toàn vẹn (SHA-256): <code style="word-break:break-all">' + c.contentHash + '</code> — ' + (contractSvc.kiemTraToanVen(c) ? '✓ nội dung khớp, chưa bị chỉnh sửa' : '⚠️ KHÔNG khớp') + '. Bấm Ctrl+P để in hoặc lưu PDF.</p></div>';
    res.send(c.html.replace('</body>', footer + '</body>'));
  } catch (e) { next(e); }
});

module.exports = router;
