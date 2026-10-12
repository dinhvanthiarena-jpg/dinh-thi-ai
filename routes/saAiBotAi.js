// Cổng AI viết bài dùng chung cho tool SA-BOTAI (xem services/geminiProxyService.js). Cần đăng nhập tài khoản tool + có mã kích hoạt còn hạn.
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const fbaiLicense = require('../services/fbaiLicenseService');
const gemini = require('../services/geminiProxyService');
const { requireBearerAuth } = require('./saAiBotAuth');

router.use(requireBearerAuth);

router.post('/write', express.json({ limit: '200kb' }), async (req, res) => {
  try {
    const user = await User.findByPk(req.authUser.id);
    if (!user) return res.status(401).json({ error: 'Tài khoản không còn tồn tại.' });
    const keys = fbaiLicense.listKeysByOwner(user.id);
    const hopLe = user.role === 'admin' || keys.some((k) => k.active !== false && (!k.expiresAt || k.expiresAt > Date.now()));
    if (!hopLe) return res.status(402).json({ error: 'Cần mã kích hoạt SA-BOTAI còn hạn để dùng AI viết bài dùng chung.' });
    const b = req.body || {};
    if (!b.user || typeof b.user !== 'string') return res.status(400).json({ error: 'Thiếu nội dung yêu cầu.' });
    const q = gemini.quota(user.id);
    if (q.used >= q.limit) return res.status(429).json({ error: 'Hôm nay đã dùng hết ' + q.limit + ' lượt AI viết bài dùng chung — ngày mai tự có lại (hoặc nhập khoá AI riêng trong Cài đặt).' });
    if (q.globalUsed >= q.globalLimit) return res.status(429).json({ error: 'AI dùng chung đã hết hạn mức hôm nay, thử lại ngày mai.' });
    const r = await gemini.write({ system: b.system, user: b.user, maxTokens: b.maxTokens });
    if (!r.ok) return res.status(503).json({ error: r.error });
    gemini.count(user.id);
    res.json({ ok: true, text: r.text, model: r.model, conLai: Math.max(0, q.limit - q.used - 1) });
  } catch (e) {
    console.error('[sa-ai-bot-ai]', e);
    res.status(500).json({ error: 'Có lỗi ở máy chủ, thử lại sau.' });
  }
});

module.exports = router;
