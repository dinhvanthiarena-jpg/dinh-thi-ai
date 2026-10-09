// Trang QUẢN TRỊ hợp đồng điện tử SA-BOTAI: danh sách, tìm kiếm, xem nguyên văn (kèm kiểm tra toàn vẹn SHA-256), xem bản mẫu hiện hành.
// Chỉ admin truy cập được; khách chỉ xem hợp đồng của chính mình qua link có token (/phap-ly-sa-botai/hop-dong/...).
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { Contract } = require('../models');
const contractSvc = require('../services/contractService');
const terms = require('../services/termsService');

router.use(requireAuth, requireAdmin);
router.use((req, res, next) => { res.locals.layout = 'layouts/admin'; next(); });

router.get('/', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    const where = q ? { [Op.or]: ['contractNo', 'customerName', 'customerEmail', 'customerPhone', 'ip'].map((f) => ({ [f]: { [Op.like]: '%' + q + '%' } })) } : {};
    const [dsHopDong, tong] = await Promise.all([
      Contract.findAll({ where, attributes: ['contractNo', 'customerName', 'customerEmail', 'customerPhone', 'ip', 'version', 'source', 'acceptedAt', 'emailedAt', 'UserId'], order: [['acceptedAt', 'DESC']], limit: 200 }),
      Contract.count(),
    ]);
    res.render('admin/hop-dong-sa-botai', { title: 'Hợp đồng SA-BOTAI', currentPath: req.originalUrl, dsHopDong, tong, q, termsVersion: terms.VERSION });
  } catch (e) { next(e); }
});

// Bản MẪU theo bảng giá hiện hành (để thầy đọc lại trước khi khách ký) — dữ liệu Bên B là ví dụ.
router.get('/mau', async (req, res, next) => {
  try {
    const html = await contractSvc.renderHopDong({
      version: terms.VERSION,
      partyB: { name: '(Họ tên khách hàng)', email: '(email)', phone: '(số điện thoại)', registeredAt: '(ngày đăng ký)' },
      contract: { contractNo: 'HD-SABOTAI-MẪU', version: terms.VERSION, acceptedAtText: '(thời điểm tích đồng ý)', ip: '(địa chỉ IP)', sourceText: 'Bản mẫu xem trong quản trị — không có giá trị giao kết' },
    });
    res.send(html);
  } catch (e) { next(e); }
});

router.get('/:no', async (req, res, next) => {
  try {
    const c = await contractSvc.theoSo(req.params.no);
    if (!c) return res.status(404).send('Không tìm thấy hợp đồng.');
    const footer = '<div style="max-width:48rem;margin:0 auto;padding:0 1rem 2rem;font:13px system-ui;color:#52525b"><hr><p>SHA-256: <code style="word-break:break-all">' + c.contentHash + '</code> — ' + (contractSvc.kiemTraToanVen(c) ? '✓ nội dung khớp, chưa bị chỉnh sửa' : '⚠️ KHÔNG khớp') + '. Ctrl+P để in / lưu PDF.</p></div>';
    res.send(c.html.replace('</body>', footer + '</body>'));
  } catch (e) { next(e); }
});

module.exports = router;
