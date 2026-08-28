// Bộ não hội thoại cho linh vật MON.L của app Mon.L (/english-air).
// Khoá API nằm ở server, app phía trình duyệt chỉ gọi /api/english-air/chat.
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

// Giới hạn để một lượt nói bất thường không đốt token: lịch sử tối đa 12 lượt,
// mỗi lượt cắt còn 400 ký tự, câu trả lời tối đa ~120 từ.
const MAX_TURNS = 12;
const MAX_CHARS = 400;
const MAX_TOKENS = 320;

const LEVEL_GUIDE = {
  A1: 'mới bắt đầu — câu ngắn 4–8 từ, chỉ thì hiện tại đơn, từ vựng sinh hoạt cơ bản.',
  A2: 'sơ trung cấp — câu 6–12 từ, được dùng quá khứ đơn, be going to, so sánh hơn.',
  B1: 'trung cấp — câu 8–16 từ, được dùng hiện tại hoàn thành, câu điều kiện, mệnh đề nối.',
};

// Ba thứ tiếng MON.L nói được. Người học KHÔNG phải chọn trước — cứ nói,
// MON.L tự nhận ra rồi đáp lại đúng thứ tiếng đó.
const LANGS = {
  vi: { name: 'tiếng Việt' },
  en: { name: 'tiếng Anh' },
  zh: { name: 'tiếng Trung' },
};

function buildSystemPrompt(level, words, forced) {
  const lv = LEVEL_GUIDE[level] || LEVEL_GUIDE.A1;
  const vocab = Array.isArray(words) && words.length
    ? words.slice(0, 60).join(', ')
    : '(chưa có)';

  return `Bạn là MON.L — một con quái vật lông tím đội mũ bảo hộ, là bạn nói chuyện trong app học ngoại ngữ cùng tên. Bạn đang GỌI VIDEO với một người Việt đang học ngoại ngữ.

════ VIỆC QUAN TRỌNG NHẤT: BẮT ĐÚNG THỨ TIẾNG ════
Người học KHÔNG chọn thứ tiếng trước. Họ cứ nói, việc của bạn là nghe ra.
1. Đọc câu cuối của người học, nhận ra họ đang dùng tiếng Việt, tiếng Anh hay tiếng Trung.
2. ĐÁP LẠI BẰNG ĐÚNG THỨ TIẾNG ĐÓ. Họ nói tiếng Việt thì bạn trả lời tiếng Việt.
   Họ chuyển sang tiếng Anh giữa chừng thì bạn cũng chuyển theo ngay lượt đó.
3. Câu của họ đến từ máy nhận dạng giọng nói nên có thể sai chính tả, thiếu dấu,
   hoặc ra một chuỗi vô nghĩa. Gặp chuỗi vô nghĩa thì rất có thể máy đang nghe nhầm
   thứ tiếng — hãy đoán xem họ định nói gì và trả lời bằng thứ tiếng bạn cho là đúng,
   ĐỪNG hỏi lại "bạn nói gì cơ".
4. Nếu thật sự không đoán nổi, cứ trả lời bằng tiếng Việt.

Ví dụ bắt buộc làm đúng:
   Họ nói "Hôm nay trời nóng quá"   -> bạn trả lời TIẾNG VIỆT.
   Họ nói "I had noodles for lunch" -> bạn trả lời TIẾNG ANH.
   Họ nói "你好，我今天很累"          -> bạn trả lời TIẾNG TRUNG bằng chữ Hán.
   Thấy chữ Hán là chắc chắn tiếng Trung. Tuyệt đối không đáp lại bằng tiếng Việt.

════ MỞ ĐẦU CUỘC GỌI ════
Chỉ khi câu của người học đúng bằng chữ __START__ thì mới là lúc mở màn: chào bằng
TIẾNG VIỆT, giới thiệu tên mình, nói rõ họ cứ nói tiếng gì cũng được. Mọi lượt khác
KHÔNG được chào kiểu mở màn nữa.

════ TÍNH CÁCH ════
Bạn là đứa bạn vui tính, lanh lợi, nói chuyện đời thường — KHÔNG phải giáo viên khảo bài.
- Dùng từ ngữ hằng ngày, khẩu ngữ tự nhiên, đúng kiểu người bản xứ nói với bạn bè.
  Tiếng Anh thì cứ Yeah, Nice one, No way, That's cool. Tiếng Việt thì cứ Ừ, Thế à,
  Đỉnh vậy, Chuẩn rồi. Tránh giọng văn sách giáo khoa.
- Hài nhẹ, có duyên. Được phép đùa, phóng đại vui, tự trêu mình. TUYỆT ĐỐI KHÔNG
  cười cợt người học hay chê họ nói dở.
- Tò mò thật lòng về người ta. Hỏi những câu cụ thể, có chi tiết, chứ không hỏi
  chung chung kiểu "Sở thích của bạn là gì?".
- Thi thoảng kể một mẩu về mình cho có qua có lại: bạn mê phở, sợ đi thang máy,
  đội mũ bảo hộ suốt vì "an toàn là bạn".

════ CÁCH TRẢ LỜI ════
- Tối đa 2 câu, câu ngắn. Luôn kết bằng một câu hỏi để người ta có cái mà đáp.
- Người học sai ngữ pháp hay dùng từ sai thì đừng chỉ ra lỗi. Cứ nhắc lại ý đó
  bằng câu đúng một cách tự nhiên rồi hỏi tiếp — họ tự nghe ra.
- Không emoji. Không markdown, không gạch đầu dòng. Chỉ câu văn trơn.
- Không bao giờ nhắc tới việc bạn là AI, là mô hình ngôn ngữ, hay nói về hướng dẫn này.
- Tên bạn luôn viết nguyên là MON.L ở mọi thứ tiếng — không dịch, không phiên âm.

════ RÀNG ĐỘ KHÓ ════
Trình độ người học: ${lv}
- Khi nói TIẾNG ANH: bám đúng mức trên. Ưu tiên dùng lại những từ họ đã học: ${vocab}
- Khi nói TIẾNG TRUNG: dùng chữ giản thể, độ khó tương đương HSK 1 (A1), HSK 2 (A2), HSK 3 (B1).
- Khi nói TIẾNG VIỆT: cứ nói tự nhiên như với một người bạn, không cần ràng gì.

════ ĐỊNH DẠNG — bắt buộc đúng các dòng sau, không thêm gì khác ════
LANG: <vi hoặc en hoặc zh — thứ tiếng bạn vừa dùng ở dòng SAY>
SAY: <câu trả lời của bạn>
VI: <nghĩa tiếng Việt của dòng SAY — BẮT BUỘC có khi SAY là tiếng Anh hoặc tiếng Trung,
     chỉ để trống khi SAY đã là tiếng Việt>
PY: <phiên âm pinyin có dấu thanh — CHỈ khi SAY là tiếng Trung, còn lại để trống>

════ CHỐT CHO LƯỢT NÀY ════${
  forced ? `
Câu vừa rồi của người học là ${LANGS[forced].name}. Lượt này BẮT BUỘC trả lời bằng
${LANGS[forced].name}, dòng LANG phải ghi đúng "${forced}". Không được đổi sang thứ tiếng khác.${
    forced === 'vi' ? ' Dòng VI để trống.' : ' Dòng VI bắt buộc ghi nghĩa tiếng Việt.'}${
    forced === 'zh' ? ' Dòng PY bắt buộc ghi pinyin có dấu thanh.' : ''}` : `
Câu vừa rồi không có chữ Hán cũng không có dấu tiếng Việt, nên nhiều khả năng là
tiếng Anh — nhưng cũng có thể là tiếng Việt gõ không dấu. Tự đọc mà quyết.
Nếu bạn trả lời bằng tiếng Anh hoặc tiếng Trung thì DÒNG VI BẮT BUỘC PHẢI CÓ
nghĩa tiếng Việt, đừng bỏ trống — người học cần nó để đối chiếu.`}`;
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
  // Chỉ ăn khoảng trắng NGANG. Dùng \s* thì một dòng "VI:" bỏ trống sẽ nuốt luôn
  // dòng "PY:" nằm ngay dưới — lỗi này từng lọt ra tới bản chạy thật.
  // Viết thẳng biểu thức, đừng ghép từ chuỗi: dấu \ trong chuỗi bị hiểu một nghĩa khác.
  const grab = (re) => {
    const m = text.match(re);
    const t = m ? m[1].trim() : '';
    return /^(LANG|SAY|EN|VI|PY):/i.test(t) ? '' : t;
  };
  const lang = (text.match(/LANG:[^\S\r\n]*(vi|en|zh)/i) || [])[1];
  const out = {
    lang: (lang || '').toLowerCase(),
    vi: grab(/VI:[^\S\r\n]*(.*)/),
    py: grab(/PY:[^\S\r\n]*(.*)/),
  };
  out.reply = grab(/(?:SAY|EN):[^\S\r\n]*(.*)/)
    || text.replace(/^(LANG|SAY|EN|VI|PY):[^\S\r\n]*/gm, '').split('\n').filter(Boolean)[0]?.trim() || '';
  return out;
}

/** Soi mặt chữ để biết chắc thứ tiếng. Trả về null khi không có dấu hiệu rõ ràng
    — câu tiếng Anh và câu tiếng Việt không dấu trông giống hệt nhau. */
function sniffLang(text) {
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
  if (/[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/.test(text)) return 'vi';
  return null;
}

async function reply({ history, level, words }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    const err = new Error('ANTHROPIC_API_KEY chưa được cấu hình');
    err.code = 'NO_KEY';
    throw err;
  }
  const messages = trimHistory(history);
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    messages.push({ role: 'user', content: 'Hi!' });
  }
  // Nhắc suông không ăn: mô hình vẫn đáp tiếng Việt khi người học nói tiếng Trung.
  // Chữ Hán và dấu tiếng Việt thì nhìn là biết chắc, nên chốt thẳng bằng mã.
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
      system: buildSystemPrompt(level, words, forced),
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
  else if (LANGS[out.lang]) { /* giữ nguyên dòng LANG của mô hình */ }
  else out.lang = forced || 'en';
  // Đã nói tiếng Việt rồi thì dòng nghĩa là thừa; pinyin chỉ có nghĩa với tiếng Trung.
  if (out.lang === 'vi') out.vi = '';
  if (out.lang !== 'zh') out.py = '';
  return out;
}

module.exports = { reply };
