const GameInstall = require('../models/GameInstall');
const homeworkHelperService = require('../services/homeworkHelperService');

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
