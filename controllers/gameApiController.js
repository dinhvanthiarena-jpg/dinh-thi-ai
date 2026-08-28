const GameInstall = require('../models/GameInstall');
const PushSubscription = require('../models/PushSubscription');
const homeworkHelperService = require('../services/homeworkHelperService');
const boomChatService = require('../services/boomChatService');

// Called by the desktop game on every launch. Upserts by installId so the
// same machine always updates one row instead of creating duplicates.
exports.ping = async (req, res) => {
  const { installId, licenseKey, teacherName, appVersion, appId, contactInfo } = req.body || {};

  if (typeof installId !== 'string' || !installId.trim() || installId.length > 100) {
    return res.status(400).json({ ok: false });
  }

  const id = installId.trim();
  const existing = await GameInstall.findOne({ where: { installId: id } });

  if (existing) {
    await existing.update({
      licenseKey: typeof licenseKey === 'string' ? licenseKey.slice(0, 60) : existing.licenseKey,
      teacherName: typeof teacherName === 'string' ? teacherName.slice(0, 60) : existing.teacherName,
      appVersion: typeof appVersion === 'string' ? appVersion.slice(0, 20) : existing.appVersion,
      contactInfo: typeof contactInfo === 'string' && contactInfo.trim() ? contactInfo.slice(0, 120) : existing.contactInfo,
      pingCount: existing.pingCount + 1,
      lastSeenAt: new Date(),
    });
  } else {
    await GameInstall.create({
      appId: typeof appId === 'string' ? appId.slice(0, 40) : 'toan-vui-cap1',
      installId: id,
      licenseKey: typeof licenseKey === 'string' ? licenseKey.slice(0, 60) : null,
      teacherName: typeof teacherName === 'string' ? teacherName.slice(0, 60) : null,
      appVersion: typeof appVersion === 'string' ? appVersion.slice(0, 20) : null,
      contactInfo: typeof contactInfo === 'string' && contactInfo.trim() ? contactInfo.slice(0, 120) : null,
      pingCount: 1,
      lastSeenAt: new Date(),
    });
  }

  res.json({ ok: true });
};

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Called from the game's "Chụp bài tập" feature. Accepts one photo
// (multipart, field "image") + an optional "strugglingMode" flag, sends it
// to Gemini's free-tier vision model, and returns a step-by-step
// explanation in Vietnamese.
exports.homeworkHelp = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, message: 'Thiếu ảnh bài tập.' });
  }
  if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
    return res.status(400).json({ ok: false, message: 'Chỉ nhận ảnh JPG, PNG hoặc WEBP.' });
  }

  const strugglingMode = req.body.strugglingMode === 'true';

  try {
    const explanation = await homeworkHelperService.explainHomeworkPhoto({
      imageBase64: req.file.buffer.toString('base64'),
      mimeType: req.file.mimetype,
      strugglingMode,
    });
    res.json({ ok: true, explanation });
  } catch (e) {
    console.error('[homework-help]', e.message);
    res.status(502).json({ ok: false, message: 'Thầy/cô AI chưa đọc được ảnh này, thử chụp lại rõ hơn giúp em nhé.' });
  }
};

// The VAPID public key is meant to be public (it's how the browser proves
// which server is allowed to send pushes to a subscription it creates) —
// serving it from an endpoint instead of hardcoding it in the client bundle
// just means it can rotate without a redeploy.
exports.vapidPublicKey = (req, res) => {
  if (!process.env.VAPID_PUBLIC_KEY) {
    return res.status(503).json({ ok: false, message: 'Thông báo chưa được bật trên server.' });
  }
  res.json({ ok: true, publicKey: process.env.VAPID_PUBLIC_KEY });
};

exports.pushSubscribe = async (req, res) => {
  const { endpoint, keys, appId } = req.body || {};
  if (typeof endpoint !== 'string' || !endpoint.trim() || !keys || typeof keys.p256dh !== 'string' || typeof keys.auth !== 'string') {
    return res.status(400).json({ ok: false, message: 'Thiếu thông tin đăng ký thông báo.' });
  }
  try {
    const existing = await PushSubscription.findOne({ where: { endpoint: endpoint.trim() } });
    const data = {
      appId: typeof appId === 'string' ? appId.slice(0, 60) : 'toan-vui-cap1',
      endpoint: endpoint.trim(),
      p256dh: keys.p256dh.slice(0, 255),
      auth: keys.auth.slice(0, 255),
    };
    if (existing) await existing.update(data);
    else await PushSubscription.create(data);
    res.json({ ok: true });
  } catch (e) {
    console.error('[push-subscribe]', e.message);
    res.status(500).json({ ok: false, message: 'Không lưu được đăng ký thông báo.' });
  }
};

exports.pushUnsubscribe = async (req, res) => {
  const { endpoint } = req.body || {};
  if (typeof endpoint !== 'string' || !endpoint.trim()) {
    return res.status(400).json({ ok: false });
  }
  await PushSubscription.destroy({ where: { endpoint: endpoint.trim() } });
  res.json({ ok: true });
};

// One turn of the "Gọi Mon.L" free-conversation call screen.
exports.boomChat = async (req, res) => {
  try {
    const { history, grade } = req.body || {};
    const safeGrade = Number.isInteger(grade) && grade >= 1 && grade <= 5 ? grade : null;
    const out = await boomChatService.reply({ history, grade: safeGrade });
    res.json({ ok: true, ...out });
  } catch (err) {
    const noKey = err.code === 'NO_KEY';
    console.error('[boom-chat]', err.message);
    res.status(noKey ? 503 : 502).json({
      ok: false,
      message: noKey ? 'Gọi Mon.L chưa bật trên máy chủ.' : 'Mon.L đang bận, thử gọi lại sau một chút nhé.',
    });
  }
};
