const express = require('express');
const tutor = require('../services/englishAirTutorService');

const router = express.Router();

// Chặn lạm dụng: mỗi IP tối đa 40 lượt nói trong 10 phút. Đủ cho một buổi
// luyện nói bình thường, nhưng không để ai đó quay vòng đốt token của thầy.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 40;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.start > WINDOW_MS) {
    hits.set(ip, { start: now, n: 1 });
    return false;
  }
  rec.n += 1;
  return rec.n > MAX_HITS;
}
// Dọn bộ nhớ định kỳ để Map không phình mãi.
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of hits) if (now - rec.start > WINDOW_MS) hits.delete(ip);
}, WINDOW_MS).unref?.();

router.post('/chat', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Bạn nói hơi nhanh rồi, nghỉ một lát rồi gọi lại nhé.' });
  }
  try {
    const { history, level, words, lang } = req.body || {};
    const out = await tutor.reply({ history, level, words, lang });
    res.json(out);
  } catch (err) {
    const noKey = err.code === 'NO_KEY';
    console.error('[english-air/chat]', err.message);
    res.status(noKey ? 503 : 502).json({
      error: noKey
        ? 'Chế độ nói chuyện tự do chưa bật trên máy chủ.'
        : 'MON.L đang bận, bạn thử lại sau một chút nhé.',
    });
  }
});

module.exports = router;
