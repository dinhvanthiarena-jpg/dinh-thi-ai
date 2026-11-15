// Trang quản trị: người đăng ký mua tool Sa Muse Ai (mount ở /admin/dang-ky-muse).
const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const MuseRegistration = require('../models/MuseRegistration');
const PushSubscription = require('../models/PushSubscription');
const svc = require('../services/museRegistrationService');

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
  res.render('admin/muse-registrations', {
    title: 'Đăng ký tool Sa Muse Ai',
    regs,
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
  return back(res, `Đã xoá đăng ký ${reg.code}${reg.licenseKey ? ' và thu hồi key ' + reg.licenseKey : ''}.`);
});

router.post('/:id/resend', async (req, res) => {
  const reg = await MuseRegistration.findByPk(req.params.id);
  if (!reg || !reg.licenseKey) return back(res, 'Chưa có key để gửi lại.');
  const r = await svc.guiLaiMail(reg);
  return back(res, r.daGuiMail ? `Đã gửi lại mail tới ${reg.email}` : `Gửi mail lỗi: ${r.loiMail}`);
});

module.exports = router;
