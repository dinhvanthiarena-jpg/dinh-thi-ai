// Trang quản trị: người đăng ký mua tool Sa Muse Ai (mount ở /admin/dang-ky-muse).
const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const MuseRegistration = require('../models/MuseRegistration');
const PushSubscription = require('../models/PushSubscription');
const svc = require('../services/museRegistrationService');
const promo = require('../services/musePromoService');

// Đơn tạo trước mốc này là gói tháng cũ (500.000đ/30 ngày) — chỉ những đơn đó mới có nút "+30 ngày".
const MOC_DOI_GIA = new Date('2026-11-21T00:00:00+07:00');

const router = express.Router();
router.use(requireAuth, requireAdmin);
router.use((req, res, next) => {
  res.locals.layout = 'layouts/admin';
  next();
});

const back = (res, msg) => res.redirect('/admin/dang-ky-muse' + (msg ? `?msg=${encodeURIComponent(msg)}` : ''));

router.get('/', async (req, res) => {
  const regs = await MuseRegistration.findAll({ order: [['createdAt', 'DESC']], limit: 500 });
  const pushCount = await PushSubscription.count({ where: { appId: svc.PUSH_APP_ID } });
  const hanKey = {};
  require('../services/museLicenseService').listKeys().forEach((k) => { hanKey[k.key] = k.expiresAt; });
  res.render('admin/muse-registrations', {
    title: 'Đăng ký tool Sa Muse Ai',
    han: svc.HAN_TEXT,
    gia: svc.GIA,
    giaCu: svc.GIA_CU,
    mocDoiGia: MOC_DOI_GIA,
    maList: promo.danhSach(),
    maTheoDon: promo.banDoDon(),
    siteUrl: (process.env.APP_URL || 'https://3dvietpro.com').replace(/\/$/, ''),
    regs,
    hanKey,
    pushCount,
    vapidPublic: process.env.VAPID_PUBLIC_KEY || '',
    telegramOk: Boolean(process.env.TELEGRAM_BOT_TOKEN && (await svc.layAdminChat())),
    maLienKet: (await svc.layAdminChat()) ? '' : await svc.layMaLienKet(),
    mailOk: Boolean(process.env.MUSE_MAIL_PASS || (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)),
    msg: String(req.query.msg || '').slice(0, 300),
  });
});

// Service worker cho thông báo đẩy (scope chỉ trong /admin/dang-ky-muse/).
router.get('/sw.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.set('Service-Worker-Allowed', '/admin/dang-ky-muse/');
  res.set('Cache-Control', 'no-store');
  res.send(`self.addEventListener('push', function (e) {
  var d = {}; try { d = e.data.json(); } catch (x) {}
  e.waitUntil(self.registration.showNotification(d.title || 'Sa Muse Ai', { body: d.body || '', data: { url: d.url || '/admin/dang-ky-muse' } }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(clients.openWindow((e.notification.data && e.notification.data.url) || '/admin/dang-ky-muse'));
});`);
});

router.post('/push-subscribe', express.json(), async (req, res) => {
  const { endpoint, keys } = req.body || {};
  if (typeof endpoint !== 'string' || !endpoint || !keys || typeof keys.p256dh !== 'string' || typeof keys.auth !== 'string') {
    return res.status(400).json({ ok: false });
  }
  const data = { appId: svc.PUSH_APP_ID, endpoint, p256dh: keys.p256dh.slice(0, 255), auth: keys.auth.slice(0, 255) };
  const existing = await PushSubscription.findOne({ where: { endpoint } });
  if (existing) await existing.update(data);
  else await PushSubscription.create(data);
  res.json({ ok: true });
});

router.post('/:id/paid', async (req, res) => {
  const r = await svc.xacNhanDaNhanTien(req.params.id);
  if (r.loi) return back(res, r.loi);
  if (r.daXuLyTruoc) return back(res, `Đã xử lý trước đó (key ${r.reg.licenseKey}).`);
  if (r.daGuiMail) return back(res, `Đã gửi key ${r.reg.licenseKey} tới ${r.reg.email}`);
  return back(res, `Đã cấp key ${r.reg.licenseKey} nhưng gửi mail LỖI: ${r.loiMail}`);
});

// Xoá đăng ký (rác/đơn thử); nếu đã cấp key thì THU HỒI key luôn.
router.post('/:id/delete', async (req, res) => {
  const reg = await MuseRegistration.findByPk(req.params.id);
  if (!reg) return back(res, 'Không tìm thấy đăng ký.');
  if (reg.licenseKey) require('../services/museLicenseService').revokeKey(reg.licenseKey);
  await reg.destroy();
  promo.hoanTheoDon(reg.code); // trả lại lượt của mã ưu đãi (nếu đơn này có dùng)
  return back(res, `Đã xoá đăng ký ${reg.code}${reg.licenseKey ? ' và thu hồi key ' + reg.licenseKey : ''}.`);
});

// ---- Mã ưu đãi: tạo / khoá-mở / xoá (đặt TRƯỚC các route /:id/... cho dễ đọc; đường dẫn không trùng nhau) ----
router.post('/ma/tao', (req, res) => {
  const r = promo.them({
    gia: String(req.body.gia || '').replace(/[^\d]/g, ''),
    toiDa: String(req.body.toiDa || '').replace(/[^\d]/g, ''),
    ma: req.body.ma,
    ghiChu: req.body.ghiChu,
    giaNiemYet: svc.GIA,
  });
  if (!r.ok) return back(res, r.loi);
  return back(res, `Đã tạo mã ${r.ma}: giá ${Number(r.gia).toLocaleString('vi-VN')}đ, ${r.toiDa ? r.toiDa + ' lượt' : 'không giới hạn lượt'}.`);
});

router.post('/ma/:ma/khoa', (req, res) => {
  const khoa = req.body.khoa === '1';
  if (!promo.datKhoa(req.params.ma, khoa)) return back(res, 'Không tìm thấy mã.');
  return back(res, `Đã ${khoa ? 'KHOÁ' : 'MỞ LẠI'} mã ${promo.chuanHoa(req.params.ma)}.`);
});

router.post('/ma/:ma/xoa', (req, res) => {
  if (!promo.xoa(req.params.ma)) return back(res, 'Không tìm thấy mã.');
  return back(res, `Đã xoá mã ${promo.chuanHoa(req.params.ma)} (các đơn đã dùng mã vẫn giữ nguyên giá).`);
});

router.post('/:id/extend', async (req, res) => {
  // Mặc định gói năm (+365 ngày). Chỉ đơn cũ gói tháng mới có nút riêng "+30 ngày" (goi=thang).
  const ngay = req.body && req.body.goi === 'thang' ? svc.NGAY_CU : svc.NGAY;
  const r = await svc.giaHan(req.params.id, ngay);
  if (r.loi) return back(res, r.loi);
  return back(res, `Đã gia hạn +${r.ngay} ngày cho ${r.reg.name}. Hạn mới: ${new Date(r.het).toLocaleDateString('vi-VN')}.`);
});

router.post('/:id/resend', async (req, res) => {
  const reg = await MuseRegistration.findByPk(req.params.id);
  if (!reg || !reg.licenseKey) return back(res, 'Chưa có key để gửi lại.');
  const r = await svc.guiLaiMail(reg);
  return back(res, r.daGuiMail ? `Đã gửi lại mail tới ${reg.email}` : `Gửi mail lỗi: ${r.loiMail}`);
});

module.exports = router;
