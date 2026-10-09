// Trang quản trị SA-BOTAI: bảng giá (phí tạo web, các gói gia hạn theo tháng), thông tin Bên A hiển thị trên
// Điều khoản dịch vụ, và xem lượt khách tự mua / web đã tạo / nhật ký đồng ý điều khoản. Mount riêng ở
// server.js (/admin/gia-key-sa-botai) nên tự gắn đủ requireAuth + requireAdmin + layout admin.
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { WalletTransaction, User, WebsiteDomain, TermsAcceptance } = require('../models');
const pricing = require('../services/fbaiKeyPricing');
const terms = require('../services/termsService');
const { Op } = require('sequelize');
const fbai = require('../services/fbaiLicenseService');

router.use(requireAuth, requireAdmin);
router.use((req, res, next) => {
  res.locals.layout = 'layouts/admin';
  next();
});

router.get('/', async (req, res, next) => {
  try {
    const giaoDich = await WalletTransaction.findAll({
      where: { relatedType: { [Op.in]: ['FbaiKey', 'FbaiKeyPlan', 'WebsiteBuild'] }, status: 'paid' },
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 30,
    });
    const webs = await WebsiteDomain.findAll({ order: [['createdAt', 'DESC']], limit: 30 });
    const userMap = {};
    (await User.findAll({ where: { id: webs.map((w) => w.UserId) }, attributes: ['id', 'name', 'email'] })).forEach((u) => { userMap[u.id] = u; });
    const dongY = await TermsAcceptance.findAll({ order: [['acceptedAt', 'DESC']], limit: 20 });
    const dongYUsers = {};
    (await User.findAll({ where: { id: dongY.map((d) => d.UserId) }, attributes: ['id', 'name', 'email'] })).forEach((u) => { dongYUsers[u.id] = u; });
    res.render('admin/fbai-key-pricing', {
      title: 'Bảng giá & thanh toán SA-BOTAI',
      cfg: pricing.getConfig(),
      usdRate: pricing.USD_RATE,
      toVnd: pricing.toVnd,
      firstKeyDays: pricing.FIRST_KEY_DAYS,
      giaoDich, webs, userMap, dongY, dongYUsers,
      termsVersion: terms.VERSION,
      saved: req.query.saved === '1',
      capKey: String(req.query.capkey || ''), giaHanKey: String(req.query.giahan || ''), soThang: parseInt(req.query.thang, 10) || 0, loi: String(req.query.loi || ''),
    });
  } catch (err) { next(err); }
});

router.post('/', (req, res) => {
  const b = req.body || {};
  const ids = [].concat(b.planId || []);
  const months = [].concat(b.months || []);
  const usds = [].concat(b.usd || []);
  const enabled = new Set([].concat(b.enabled || []).map(String));
  const plans = ids.map((id, i) => ({ id, months: Number(months[i]), usd: Number(String(usds[i] || '').replace(/[^0-9.]/g, '')), kind: id === 'khoi-dau' ? 'first' : undefined, enabled: enabled.has(String(id)) }))
    .filter((p) => p.months >= 1 && p.usd > 0);
  pricing.saveConfig({
    usdRate: Number(String(b.usdRate || '').replace(/[^0-9]/g, '')) || undefined,
    webFeeUsd: Number(String(b.webFeeUsd || '').replace(/[^0-9.]/g, '')) || undefined,
    plans: plans.length ? plans : undefined,
    legal: { ten: String(b.ten || '').slice(0, 200), mst: String(b.mst || '').slice(0, 100), diaChi: String(b.diaChi || '').slice(0, 300), email: String(b.email || '').slice(0, 120) },
  });
  res.redirect('/admin/gia-key-sa-botai?saved=1');
});

// Cấp key MỚI với số tháng tuỳ chọn (1 tháng = 30 ngày). Máy chủ là nơi giữ hạn dùng — tool chỉ đọc lại, nên KHÔNG cần
// lập trình key riêng theo tháng: mọi key đều dạng FBAI-xxxx, hạn nằm ở bản ghi trên máy chủ.
router.post('/cap-key', (req, res) => {
  const months = Math.min(60, Math.max(1, parseInt((req.body || {}).months, 10) || 3));
  const note = String((req.body || {}).note || '').slice(0, 200);
  const entry = fbai.issueKey(note || 'Cấp từ trang giá', null, months * 30);
  res.redirect('/admin/gia-key-sa-botai?capkey=' + encodeURIComponent(entry.key) + '&thang=' + months);
});

// Gia hạn 1 key đã có thêm N tháng (cộng vào hạn còn lại; key hết hạn thì tính từ hôm nay; bật lại nếu đã tắt).
router.post('/gia-han', (req, res) => {
  const months = Math.min(60, Math.max(1, parseInt((req.body || {}).months, 10) || 1));
  const key = fbai.normalizeAndFormat(String((req.body || {}).key || ''));
  fbai.reactivateKey(key); // bật lại nếu key đang bị tắt (khách trả tiền gia hạn)
  const r = fbai.extendKey(key, null, months * 30);
  res.redirect('/admin/gia-key-sa-botai?' + (r.entry ? 'giahan=' + encodeURIComponent(key) + '&thang=' + months : 'loi=' + encodeURIComponent(r.error === 'not_found' ? 'Không tìm thấy key này.' : 'Không gia hạn được (' + r.error + ').')));
});

module.exports = router;
