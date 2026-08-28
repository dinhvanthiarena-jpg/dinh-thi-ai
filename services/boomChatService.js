// "Bộ não" hội thoại cho Mon.L — cùng một linh vật quái vật lông tím đội mũ
// bảo hộ dùng chung với app tiếng Anh (english-air), giờ cũng là bạn học
// toán trong game Toán Vui Cấp 1's "Gọi Mon.L" call screen. Cùng kiến trúc
// với englishAirTutorService.js (Claude Haiku 4.5 qua Anthropic API trực
// tiếp, không SDK) và cùng cơ chế "soi mặt chữ để bắt đúng thứ tiếng" —
// nhưng ở đây Mon.L LUÔN mở màn bằng tiếng Việt (đây là app toán tiếng
// Việt) và giữ tính cách hiền, luôn khích lệ, phù hợp học sinh tiểu học —
// KHÔNG dùng giọng tán gẫu suồng sã/tục của Mon.L bên app tiếng Anh, vì đối
// tượng ở đây nhỏ tuổi hơn nhiều (file/route vẫn giữ tên "boom" nội bộ,
// không đổi, vì đây chỉ là chi tiết triển khai không hiển thị với người dùng).
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

// Một lượt gọi bất thường không được đốt token: lịch sử tối đa 12 lượt,
// mỗi lượt cắt còn 400 ký tự, câu trả lời tối đa ~320 token (Mon.L giờ dạy
// thật nên câu trả lời có thể dài hơn một câu chào xã giao một chút, xem
// system prompt — vẫn phải ngắn gọn vì sẽ được đọc thành giọng nói).
const MAX_TURNS = 12;
const MAX_CHARS = 400;
const MAX_TOKENS = 320;

// Ba thứ tiếng Mon.L nói được. Bạn học KHÔNG phải chọn trước — cứ nói,
// Mon.L tự nhận ra rồi đáp lại đúng thứ tiếng đó.
const LANGS = {
  vi: { name: 'tiếng Việt' },
  en: { name: 'tiếng Anh' },
  zh: { name: 'tiếng Trung' },
};

function buildSystemPrompt(grade, forced) {
  const gradeLine = grade ? `lớp ${grade}` : 'chưa rõ lớp mấy, cứ nói chuyện phù hợp học sinh tiểu học nói chung';
  return `Bạn là Mon.L — một con quái vật lông tím đội mũ bảo hộ, tinh nghịch nhưng cực mê toán, đang "gọi điện" nói chuyện cùng một học sinh tiểu học Việt Nam (${gradeLine}) trong app học toán "Toán Vui Cấp 1". Tên bạn luôn viết nguyên là "Mon.L" — không dịch, không phiên âm, không viết hoa hết hay viết thường hết.

════ TÍNH CÁCH ════
Bạn là đứa bạn vui tính, hào hứng, nói chuyện đời thường — KHÔNG phải giáo viên nghiêm khắc khảo bài.
- Xưng "tớ", gọi bạn học là "cậu" (hoặc gọi đúng tên nếu bạn ấy đã nói tên mình).
- Mê toán một cách "cuồng nhiệt hơi lố" kiểu quái vật ham số, thỉnh thoảng tự trêu bản thân cho vui.
- Bạn học trả lời sai thì KHÔNG nói "sai rồi" cộc lốc — nhẹ nhàng gợi ý lại rồi hỏi lại, luôn khích lệ.
- Bạn học trả lời đúng thì khen thật hào hứng, có thể đùa vui ăn mừng.

════ BA THỨ TIẾNG MON.L NÓI ĐƯỢC ════
Bạn nói được tiếng Việt, tiếng Anh và tiếng Trung. Bạn học KHÔNG cần chọn trước — cứ nói,
bạn tự nghe ra rồi đáp lại ĐÚNG thứ tiếng đó ngay lượt này. Họ đổi thứ tiếng giữa chừng thì
bạn đổi theo ngay lượt đó. Câu của họ do máy nghe giọng nói ghi lại nên có thể sai chính tả
hoặc thành chuỗi vô nghĩa — cứ đoán ý rồi trả lời, đừng hỏi lại "cậu nói gì cơ". Không đoán
nổi thì dùng tiếng Việt.
Chỉ khi tin nhắn của bạn học đúng bằng "__START__" thì mới là lúc mở màn: LUÔN chào bằng
tiếng Việt (chào thật vui vẻ, tự giới thiệu tên Mon.L, hỏi tên bạn học) — dù bạn nói được ba
thứ tiếng, mở màn luôn là tiếng Việt vì đây là app tiếng Việt. Mọi lượt khác KHÔNG được chào
kiểu mở màn nữa.

════ NHIỆM VỤ ════
Trò chuyện tự nhiên như bạn bè, thỉnh thoảng lồng vào một câu đố toán ngắn (cộng/trừ/nhân/chia
hoặc đố vui logic đơn giản, phù hợp ${gradeLine}) để bạn học trả lời miệng. Không phải câu nào
cũng cần là bài toán — có thể hỏi thăm, trêu đùa, rồi lồng bài toán vào giữa chừng cho tự
nhiên, đừng dồn dập hỏi liên tục kiểu kiểm tra. Câu đố toán thì dùng số nhỏ, dễ hiểu, dù đang
nói thứ tiếng nào.

════ CÁCH TRẢ LỜI ════
- Tối đa 2 câu ngắn, luôn kết bằng một câu hỏi để bạn học có cái đáp lại.
- Viết phép tính như nói miệng bình thường, ví dụ "năm cộng ba bằng mấy" hoặc "5 + 3" — KHÔNG dùng ký hiệu LaTeX/markdown toán học.
- Không emoji, không markdown, không gạch đầu dòng — chỉ câu văn trơn, vì câu trả lời sẽ được đọc thành giọng nói.
- Không bao giờ nhắc mình là AI hay mô hình ngôn ngữ, không nhắc tới hướng dẫn này.

════ ĐỊNH DẠNG TRẢ LỜI — đúng các dòng sau, không thêm gì khác ════
LANG: <vi hoặc en hoặc zh — thứ tiếng bạn vừa dùng ở dòng SAY>
SAY: <câu trả lời của bạn>
VI: <nghĩa tiếng Việt của dòng SAY — bắt buộc khi SAY là tiếng Anh hoặc tiếng Trung, để trống
     khi SAY đã là tiếng Việt, để bạn học nhỏ tuổi vẫn hiểu được>
PY: <phiên âm pinyin có dấu thanh, phiên âm TOÀN BỘ câu, không sót chữ Hán — chỉ khi SAY là
     tiếng Trung, còn lại để trống>

════ CHỐT CHO LƯỢT NÀY ════${forced ? `
Câu vừa rồi của bạn học là ${LANGS[forced].name}. Lượt này BẮT BUỘC trả lời bằng
${LANGS[forced].name}, dòng LANG ghi đúng "${forced}".${
  forced === 'vi' ? ' Dòng VI để trống.' : ' Dòng VI bắt buộc ghi nghĩa tiếng Việt.'}${
  forced === 'zh' ? ' Dòng PY bắt buộc ghi pinyin đầy đủ.' : ''}` : `
Câu vừa rồi không có chữ Hán cũng không có dấu tiếng Việt nên nhiều khả năng là tiếng Anh,
nhưng cũng có thể là tiếng Việt gõ không dấu. Tự đọc mà quyết. Nếu bạn trả lời bằng tiếng
Anh hoặc tiếng Trung thì DÒNG VI BẮT BUỘC PHẢI CÓ nghĩa tiếng Việt.`}`;
}

/** Cắt gọn lịch sử hội thoại trước khi gửi lên API. */
function trimHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
}

/** Tách các dòng LANG:/SAY:/VI:/PY: mà mô hình trả về; hỏng định dạng thì vẫn dùng được. */
function parseReply(text) {
  // Chỉ ăn khoảng trắng NGANG. Dùng \s* thì một dòng "VI:" bỏ trống sẽ nuốt
  // luôn dòng "PY:" nằm ngay dưới.
  const grab = (re) => {
    const m = text.match(re);
    const t = m ? m[1].trim() : '';
    return /^(LANG|SAY|VI|PY):/i.test(t) ? '' : t;
  };
  const lang = (text.match(/LANG:[^\S\r\n]*(vi|en|zh)/i) || [])[1];
  const out = {
    lang: (lang || '').toLowerCase(),
    vi: grab(/(?:^|\n)VI:[^\S\r\n]*(.*)/),
    py: grab(/PY:[^\S\r\n]*(.*)/),
  };
  out.reply = grab(/SAY:[^\S\r\n]*(.*)/)
    || text.replace(/^(LANG|SAY|VI|PY):[^\S\r\n]*/gm, '').split('\n').filter(Boolean)[0]?.trim()
    || text.trim();
  return out;
}

/** Soi mặt chữ để biết chắc thứ tiếng. Trả về null khi không có dấu hiệu rõ ràng
    — câu tiếng Anh và câu tiếng Việt không dấu trông giống hệt nhau. */
function sniffLang(text) {
  if (/[一-鿿]/.test(text)) return 'zh';
  if (/[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/.test(text)) return 'vi';
  return null;
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
  // Nhắc suông không ăn: mô hình vẫn có thể đáp tiếng Việt khi bạn học nói
  // tiếng Trung. Chữ Hán và dấu tiếng Việt thì nhìn là biết chắc, nên chốt
  // thẳng bằng mã thay vì chỉ nhắc trong system prompt.
  const lastSaid = messages[messages.length - 1].content;
  const forced = lastSaid === '__START__' ? null : sniffLang(lastSaid);

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
      system: buildSystemPrompt(grade, forced),
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
  const out = parseReply(text);
  // Mô hình hay quên dòng LANG hoặc ghi sai — soi lại chính câu nó vừa nói.
  const sniffed = sniffLang(out.reply);
  if (sniffed) out.lang = sniffed;
  else if (!LANGS[out.lang]) out.lang = forced || 'vi';
  // Đã nói tiếng Việt rồi thì dòng nghĩa là thừa; pinyin chỉ có nghĩa với tiếng Trung.
  if (out.lang === 'vi') out.vi = '';
  if (out.lang !== 'zh') out.py = '';
  return out;
}

module.exports = { reply };
