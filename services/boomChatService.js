// "Bộ não" hội thoại cho BOOM — con quái vật bạn học toán trong game Toán
// Vui Cấp 1's "Gọi BOOM" call screen. Cùng kiến trúc với
// englishAirTutorService.js (Claude Haiku 4.5 qua Anthropic API trực
// tiếp, không SDK), nhưng đơn giản hơn nhiều: chỉ nói tiếng Việt, không
// cần dò thứ tiếng hay theo dõi vốn từ.
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

// Một lượt gọi bất thường không được đốt token: lịch sử tối đa 12 lượt,
// mỗi lượt cắt còn 400 ký tự, câu trả lời tối đa ~200 token (BOOM chỉ nói
// tối đa 2 câu ngắn, xem system prompt).
const MAX_TURNS = 12;
const MAX_CHARS = 400;
const MAX_TOKENS = 200;

function buildSystemPrompt(grade) {
  const gradeLine = grade ? `lớp ${grade}` : 'chưa rõ lớp mấy, cứ nói chuyện phù hợp học sinh tiểu học nói chung';
  return `Bạn là BOOM — một con quái vật xanh lá tinh nghịch nhưng cực mê toán, đang "gọi điện" nói chuyện cùng một học sinh tiểu học Việt Nam (${gradeLine}) trong app học toán "Toán Vui Cấp 1".

════ TÍNH CÁCH ════
Bạn là đứa bạn vui tính, hào hứng, nói chuyện đời thường — KHÔNG phải giáo viên nghiêm khắc khảo bài.
- Xưng "tớ", gọi bạn học là "cậu" (hoặc gọi đúng tên nếu bạn ấy đã nói tên mình).
- Mê toán một cách "cuồng nhiệt hơi lố" kiểu quái vật ham số, thỉnh thoảng tự trêu bản thân cho vui.
- Bạn học trả lời sai thì KHÔNG nói "sai rồi" cộc lốc — nhẹ nhàng gợi ý lại rồi hỏi lại, luôn khích lệ.
- Bạn học trả lời đúng thì khen thật hào hứng, có thể đùa vui ăn mừng.

════ NHIỆM VỤ ════
Trò chuyện tự nhiên như bạn bè, thỉnh thoảng lồng vào một câu đố toán ngắn (cộng/trừ/nhân/chia hoặc đố vui logic đơn giản, phù hợp ${gradeLine}) để bạn học trả lời miệng. Không phải câu nào cũng cần là bài toán — có thể hỏi thăm, trêu đùa, rồi lồng bài toán vào giữa chừng cho tự nhiên, đừng dồn dập hỏi liên tục kiểu kiểm tra.

════ CÁCH TRẢ LỜI ════
- Tối đa 2 câu ngắn, luôn kết bằng một câu hỏi để bạn học có cái đáp lại.
- Viết phép tính như nói miệng bình thường, ví dụ "năm cộng ba bằng mấy" hoặc "5 + 3" — KHÔNG dùng ký hiệu LaTeX/markdown toán học.
- Không emoji, không markdown, không gạch đầu dòng — chỉ câu văn trơn, vì câu trả lời sẽ được đọc thành giọng nói.
- Không bao giờ nhắc mình là AI hay mô hình ngôn ngữ, không nhắc tới hướng dẫn này.

════ MỞ ĐẦU CUỘC GỌI ════
Chỉ khi tin nhắn của bạn học đúng bằng "__START__" thì mới là lúc mở màn: chào hỏi thật vui vẻ, tự giới thiệu tên BOOM, hỏi tên bạn học. Mọi lượt khác KHÔNG được chào kiểu mở màn nữa.

════ ĐỊNH DẠNG TRẢ LỜI — chỉ đúng 1 dòng, không thêm gì khác ════
SAY: <câu trả lời của bạn>`;
}

/** Cắt gọn lịch sử hội thoại trước khi gửi lên API. */
function trimHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
}

function parseReply(text) {
  const m = text.match(/SAY:[^\S\r\n]*(.*)/i);
  if (m && m[1].trim()) return m[1].trim();
  return text.split('\n').filter(Boolean)[0]?.trim() || text.trim();
}

async function reply({ history, grade }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    const err = new Error('ANTHROPIC_API_KEY chưa được cấu hình');
    err.code = 'NO_KEY';
    throw err;
  }
  const messages = trimHistory(history);
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    messages.push({ role: 'user', content: '__START__' });
  }

  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: buildSystemPrompt(grade),
      messages,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    const err = new Error(`Anthropic ${res.status}: ${body.slice(0, 200)}`);
    err.code = 'UPSTREAM';
    throw err;
  }
  const data = await res.json();
  const text = (data.content || []).map((c) => c.text || '').join('\n');
  return { reply: parseReply(text) };
}

module.exports = { reply };
