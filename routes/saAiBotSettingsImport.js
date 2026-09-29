// "Cổng nhận thông tin" — thầy dán 1 khối text lộn xộn chứa NHIỀU API
// key/credential khác nhau (Claude, Facebook App ID/Secret, Pexels, Google
// PageSpeed, hosting SSH, địa chỉ API nhận bài...) và AI tự tách ra đúng
// từng ô cấu hình của tool desktop SA-AI BOT — không cần điền tay từng mục.
//
// Dùng CHUNG key Claude của CHÍNH SERVER NÀY (process.env.ANTHROPIC_API_KEY,
// đã có sẵn, không lộ ra ngoài) làm "vốn mồi" cho bước phân tích này — vì
// đây là bước XẢY RA TRƯỚC KHI khách có key Claude riêng của họ (con gà và
// quả trứng: cần AI để tự điền cấu hình, nhưng cấu hình đó lại gồm cả chính
// cái key Claude). Từ sau bước này, nếu khối text có key Claude riêng của
// khách, tool sẽ lưu và DÙNG KEY CỦA KHÁCH cho mọi việc khác — endpoint này
// chỉ dùng đúng 1 lần lúc "mồi" ban đầu.
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { requireBearerAuth } = require('./saAiBotAuth');

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-5';

// Giới hạn rộng rãi nhưng có chặn — mỗi lần gọi tốn token thật trên key
// dùng chung của server, không để bị lạm dụng vô hạn.
const importLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 15 });

router.use(requireBearerAuth);

const SCHEMA_DESC = `{
  "claudeKey": "API key Claude/Anthropic của khách, dạng 'sk-ant-...' (không phải key server)",
  "appId": "Facebook App ID (chuỗi số)",
  "appSecret": "Facebook App Secret",
  "pexelsApiKey": "Pexels API key (dùng tìm ảnh)",
  "googlePageSpeedApiKey": "Google PageSpeed Insights API key",
  "hostingDomain": "Tên miền của khách, VD example.com (không kèm http/https)",
  "hostingHost": "Địa chỉ IP/host SSH của hosting/VPS",
  "hostingPort": "Cổng SSH (số, mặc định 22 nếu không thấy)",
  "hostingUsername": "Tên đăng nhập SSH",
  "hostingPassword": "Mật khẩu SSH",
  "telegramBotToken": "Token bot Telegram (dạng số:chữ...)",
  "websiteTargetName": "Tên gợi nhớ cho 'Website nhận bài' nếu có nhắc tới website đích để đăng bài tự động",
  "websiteTargetApiUrl": "Địa chỉ API nhận bài (URL đầy đủ, VD https://domain.com/api/auto-post)",
  "websiteTargetAuthToken": "Mã xác thực/token đi kèm địa chỉ API nhận bài ở trên"
}`;

router.post('/auto-import', importLimiter, express.json({ limit: '200kb' }), async (req, res) => {
  const rawText = String((req.body || {}).rawText || '').trim();
  if (!rawText) return res.status(400).json({ error: 'Chưa có nội dung để phân tích.' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'Server chưa cấu hình ANTHROPIC_API_KEY.' });

  const system = `Bạn là bộ phân tích cấu hình cho 1 tool desktop. Người dùng dán vào 1 khối văn bản lộn xộn (có thể chứa nhãn tiếng Việt/Anh, thứ tự bất kỳ, nhiều dòng thừa) chứa một số API key/thông tin đăng nhập. Nhiệm vụ: TRÍCH XUẤT các trường sau nếu tìm thấy trong văn bản, CHỈ điền trường nào chắc chắn nhận diện được (đừng đoán mò/bịa), bỏ qua (không có trong JSON trả về) nếu không thấy:
${SCHEMA_DESC}
Trả lời CHỈ bằng 1 khối JSON hợp lệ (không markdown, không code fence, không giải thích), chỉ gồm các trường THỰC SỰ tìm thấy.`;

  try {
    const apiRes = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        system,
        messages: [{ role: 'user', content: rawText.slice(0, 20000) }],
      }),
    });
    if (!apiRes.ok) {
      const body = await apiRes.text().catch(() => '');
      return res.status(502).json({ error: `Lỗi gọi AI (HTTP ${apiRes.status}): ${body.slice(0, 200)}` });
    }
    const data = await apiRes.json();
    const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n');
    let parsed;
    try {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(match ? match[0] : text);
    } catch (e) {
      return res.status(502).json({ error: 'AI không trả về đúng định dạng — thử lại.' });
    }
    res.json({ ok: true, fields: parsed });
  } catch (err) {
    console.error('[sa-ai-bot-settings-import]', err);
    res.status(500).json({ error: 'Có lỗi ở máy chủ, thử lại sau.' });
  }
});

module.exports = router;
