// Bộ gọi AI DÙNG CHUNG cho việc viết bài (nhà máy tin tức + caption Facebook).
// Mặc định dùng Gemini gói miễn phí để khỏi tốn tiền Claude (yêu cầu thầy
// 2026-10-12). Đổi nhà cung cấp chỉ cần đặt ARTICLE_AI_PROVIDER=claude trong
// .env rồi khởi động lại app — không phải sửa code.
//
// KHÔNG tự động chuyển sang Claude khi Gemini lỗi/hết hạn mức: làm vậy sẽ âm
// thầm tiêu tiền thật trái ý thầy. Gemini lỗi thì trả null, người gọi bỏ qua
// lần đó và bộ lập lịch (chạy hằng giờ) tự thử lại sau.
const PROVIDER = () => (process.env.ARTICLE_AI_PROVIDER || 'gemini').toLowerCase();

// Cùng danh sách model mà services/geminiProxyService.js đang dùng ổn định.
const GEMINI_MODELS = () =>
  (process.env.GEMINI_MODELS || 'gemini-flash-latest,gemini-3.1-flash-lite,gemini-flash-lite-latest')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Model nào đã báo không hiểu thinkingConfig thì lần sau khỏi gửi nữa.
const modelsWithoutThinkingConfig = new Set();

async function callGeminiOnce(model, key, body) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90000),
    });
    let json = null;
    try {
      json = await res.json();
    } catch (e) {
      /* không phải JSON */
    }
    return { status: res.status, json };
  } catch (err) {
    return { status: 0, json: null, error: err.message };
  }
}

function extractText(json) {
  const parts = json && json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts;
  return (parts || []).map((p) => p.text || '').join('').trim();
}

async function completeWithGemini({ system, user, imageBase64, mimeType, maxTokens, json }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('[articleAi] Thiếu GEMINI_API_KEY — không viết được bài.');
    return null;
  }

  const userParts = [{ text: user }];
  if (imageBase64) userParts.push({ inline_data: { mime_type: mimeType || 'image/jpeg', data: imageBase64 } });

  const buildBody = (withThinkingConfig) => ({
    ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
    contents: [{ role: 'user', parts: userParts }],
    generationConfig: {
      // Model "suy nghĩ" tính cả token suy nghĩ vào maxOutputTokens — để dư
      // chỗ, không thì câu trả lời ngắn (CO/KHONG) bị cắt thành rỗng.
      maxOutputTokens: Math.max(1024, maxTokens || 2048),
      temperature: 0.7,
      ...(json ? { responseMimeType: 'application/json' } : {}),
      ...(withThinkingConfig ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
    },
  });

  let lastError = '';
  for (const model of GEMINI_MODELS()) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const useThinkingConfig = !modelsWithoutThinkingConfig.has(model);
      let r = await callGeminiOnce(model, key, buildBody(useThinkingConfig));

      if (r.status === 400 && useThinkingConfig) {
        modelsWithoutThinkingConfig.add(model);
        r = await callGeminiOnce(model, key, buildBody(false));
      }

      const text = extractText(r.json);
      if (r.status === 200 && text) return text;

      lastError = (r.json && r.json.error && r.json.error.message) || r.error || `HTTP ${r.status}`;
      if (r.status === 503 || r.status === 500 || r.status === 0) {
        await sleep(1500);
        continue;
      }
      break; // 429 (hết hạn mức)/404/400...: sang model khác
    }
  }
  console.error('[articleAi] Gemini hết model để thử:', lastError);
  return null;
}

async function completeWithClaude({ system, user, imageBase64, mimeType, maxTokens }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const content = imageBase64
    ? [
        { type: 'image', source: { type: 'base64', media_type: mimeType || 'image/jpeg', data: imageBase64 } },
        { type: 'text', text: user },
      ]
    : user;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      // Haiku 5.5 (rẻ nhất), tắt suy nghĩ sâu — bài viết không cần. Đặt ARTICLE_CLAUDE_MODEL để đổi.
      model: process.env.ARTICLE_CLAUDE_MODEL || 'claude-haiku-5-5',
      thinking: { type: 'disabled' },
      max_tokens: maxTokens || 1024,
      ...(system ? { system } : {}),
      messages: [{ role: 'user', content }],
    }),
  });
  if (!response.ok) {
    console.error('[articleAi] Claude lỗi', response.status, await response.text());
    return null;
  }
  const data = await response.json();
  return (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}

/**
 * @param {object} o
 * @param {string} [o.system]
 * @param {string} o.user
 * @param {string} [o.imageBase64] + o.mimeType — gửi kèm 1 ảnh (kiểm tra ảnh bìa)
 * @param {number} [o.maxTokens]
 * @param {boolean} [o.json] — yêu cầu trả JSON (Gemini sẽ ép đúng định dạng)
 * @returns {Promise<string|null>} văn bản trả về, hoặc null nếu lỗi
 */
async function complete(o) {
  try {
    return PROVIDER() === 'claude' ? await completeWithClaude(o) : await completeWithGemini(o);
  } catch (err) {
    console.error('[articleAi] lỗi:', err.message);
    return null;
  }
}

module.exports = { complete, PROVIDER };
