// Cổng AI viết bài dùng chung cho tool SA-BOTAI (xem services/geminiProxyService.js). Cần đăng nhập tài khoản tool + có mã kích hoạt còn hạn.
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const fbaiLicense = require('../services/fbaiLicenseService');
const gemini = require('../services/geminiProxyService');
const { requireBearerAuth } = require('./saAiBotAuth');
const crypto = require('crypto');

// Bản ĐỐI TÁC của tool (không cần mã kích hoạt) gửi kèm mã bản đối tác; máy chủ chỉ lưu mã băm sha256 của nó.
const PARTNER_TOKEN_SHA256 = () => process.env.PARTNER_TOKEN_SHA256 || 'ea672bc95e83760f5fae7da60b51fe13a4c32b4e4f8bd2291eafc66de2cdfb56';
function isPartnerToken(t) {
  if (typeof t !== 'string' || t.length < 20 || t.length > 200) return false;
  const want = Buffer.from(PARTNER_TOKEN_SHA256(), 'utf8');
  const got = Buffer.from(crypto.createHash('sha256').update(t).digest('hex'), 'utf8');
  return want.length === got.length && crypto.timingSafeEqual(want, got);
}

router.use(requireBearerAuth);

router.post('/write', express.json({ limit: '200kb' }), async (req, res) => {
  try {
    const user = await User.findByPk(req.authUser.id);
    if (!user) return res.status(401).json({ error: 'Tài khoản không còn tồn tại.' });
    const b = req.body || {};
    const keys = fbaiLicense.listKeysByOwner(user.id);
    const hasKey = user.role === 'admin' || keys.some((k) => k.active !== false && (!k.expiresAt || k.expiresAt > Date.now()));
    const partner = !hasKey && isPartnerToken(b.partnerToken);
    if (!hasKey && !partner) return res.status(402).json({ error: 'Cần mã kích hoạt SA-BOTAI còn hạn để dùng AI viết bài dùng chung.' });
    const pool = partner ? 'partner' : undefined;
    if (!b.user || typeof b.user !== 'string') return res.status(400).json({ error: 'Thiếu nội dung yêu cầu.' });
    const kind = b.kind === 'chat' ? 'chat' : 'write';
    const q = gemini.quota(user.id, kind, pool);
    if (q.used >= q.limit) return res.status(429).json({ error: 'Hôm nay đã dùng hết ' + q.limit + ' lượt AI ' + (kind === 'chat' ? 'trả lời tin nhắn' : 'viết bài') + ' dùng chung — ngày mai tự có lại (hoặc nhập khoá AI riêng trong Cài đặt).' });
    if (q.globalUsed >= q.globalLimit) return res.status(429).json({ error: 'AI dùng chung đã hết hạn mức hôm nay, thử lại ngày mai.' });
    const r = await gemini.write({ system: b.system, user: b.user, maxTokens: b.maxTokens, history: b.history });
    if (!r.ok) return res.status(503).json({ error: r.error });
    gemini.count(user.id, kind, pool);
    res.json({ ok: true, text: r.text, model: r.model, conLai: Math.max(0, q.limit - q.used - 1) });
  } catch (e) {
    console.error('[sa-ai-bot-ai]', e);
    res.status(500).json({ error: 'Có lỗi ở máy chủ, thử lại sau.' });
  }
});

module.exports = router;
