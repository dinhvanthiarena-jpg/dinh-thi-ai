// AI viết bài DÙNG CHUNG cho tool SA-BOTAI: khách không phải nhập khoá — tool gọi máy chủ này, máy chủ giữ khoá Gemini (biến GEMINI_API_KEY
// trong .env) và gọi Google. Khoá KHÔNG bao giờ nằm trong phần mềm khách tải về. Có hạn mức theo ngày cho từng khách + toàn hệ thống
// để không cạn gói miễn phí / không bị lạm dụng. Đổi model/nhà cung cấp tại đây là mọi khách đổi theo, khỏi phát hành bản mới.
const https = require('https');
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'ai-usage.json');
const MODELS = (process.env.GEMINI_MODELS || 'gemini-flash-latest,gemini-3.1-flash-lite,gemini-flash-lite-latest').split(',').map((s) => s.trim()).filter(Boolean);
const PER_USER = () => Number(process.env.GEMINI_DAILY_PER_USER) || 40;
const GLOBAL = () => Number(process.env.GEMINI_DAILY_GLOBAL) || 800;
// Trả lời tin nhắn tự động (Zalo/Telegram) tính RIÊNG để không làm cạn lượt viết bài và ngược lại.
const CHAT_PER_USER = () => Number(process.env.GEMINI_CHAT_DAILY_PER_USER) || 200;
const CHAT_GLOBAL = () => Number(process.env.GEMINI_CHAT_DAILY_GLOBAL) || 1200;

const today = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10); // ngày theo giờ Việt Nam
function load() {
  try {
    const j = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    if (j.date === today()) return j;
  } catch (e) { /* chưa có */ }
  return { date: today(), global: 0, users: {}, chatGlobal: 0, chatUsers: {} };
}
function save(u) {
  try { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(u)); } catch (e) { /* bỏ qua */ }
}
function quota(userId, kind) {
  const u = load();
  if (kind === 'chat') return { used: (u.chatUsers || {})[userId] || 0, limit: CHAT_PER_USER(), globalUsed: u.chatGlobal || 0, globalLimit: CHAT_GLOBAL() };
  return { used: u.users[userId] || 0, limit: PER_USER(), globalUsed: u.global, globalLimit: GLOBAL() };
}
function count(userId, kind) {
  const u = load();
  if (kind === 'chat') {
    u.chatGlobal = (u.chatGlobal || 0) + 1;
    u.chatUsers = u.chatUsers || {};
    u.chatUsers[userId] = (u.chatUsers[userId] || 0) + 1;
  } else {
    u.global += 1;
    u.users[userId] = (u.users[userId] || 0) + 1;
  }
  save(u);
}
// Lịch sử hội thoại: chỉ nhận {role:user|assistant, content:chuỗi}, tối đa 12 lượt, bắt đầu bằng lượt của khách.
function cleanHistory(history) {
  const out = (Array.isArray(history) ? history : [])
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-12)
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content.slice(0, 4000) }] }));
  while (out.length && out[0].role !== 'user') out.shift();
  return out;
}

function post(model, key, body) {
  return new Promise((resolve) => {
    const payload = JSON.stringify(body);
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/' + encodeURIComponent(model) + ':generateContent',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'x-goog-api-key': key },
      timeout: 80000,
    }, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => {
        let j = null;
        try { j = JSON.parse(d); } catch (e) { /* không phải JSON */ }
        resolve({ status: res.statusCode, json: j });
      });
    });
    req.on('error', () => resolve({ status: 0, json: null }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, json: null }); });
    req.write(payload);
    req.end();
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Viết bài: thử lần lượt các model, quá tải (503/500) thì thử lại 1 lần rồi sang model kế. Trả {ok,text,model} hoặc {ok:false,error}. */
async function write({ system, user, maxTokens, history }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { ok: false, error: 'Máy chủ chưa cấu hình AI dùng chung.' };
  const body = {
    systemInstruction: { parts: [{ text: String(system || '').slice(0, 12000) }] },
    contents: [...cleanHistory(history), { role: 'user', parts: [{ text: String(user || '').slice(0, 12000) }] }],
    generationConfig: { maxOutputTokens: Math.min(8192, Math.max(512, Number(maxTokens) || 2000)), temperature: 0.8 },
  };
  let last = '';
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const r = await post(model, key, body);
      const parts = r.json && r.json.candidates && r.json.candidates[0] && r.json.candidates[0].content && r.json.candidates[0].content.parts;
      const text = (parts || []).map((p) => p.text || '').join('').trim();
      if (r.status === 200 && text) return { ok: true, text, model };
      last = (r.json && r.json.error && r.json.error.message) || ('HTTP ' + r.status);
      if (r.status === 503 || r.status === 500 || r.status === 0) { await sleep(1500); continue; }
      break; // 404/429/400...: sang model khác
    }
  }
  console.error('[gemini-proxy] hết model:', last);
  return { ok: false, error: 'AI dùng chung đang quá tải, thử lại sau.' };
}

module.exports = { write, quota, count, MODELS };
