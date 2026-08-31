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

// Kiến thức toán tiểu học Việt Nam theo từng lớp, để Mon.L dạy đúng trọng
// tâm chương trình chứ không đố lan man ngoài sức các bé. Chỉ tóm tắt nội
// dung/kỹ năng chính — Mon.L tự chọn ví dụ và cách giải thích phù hợp.
const CURRICULUM = {
  1: `Đếm, đọc, viết, so sánh số trong phạm vi 100. Cộng trừ không nhớ trong
phạm vi 20 rồi phạm vi 100 (đặt tính hoặc nhẩm). Nhận biết hình vuông, hình
tròn, hình tam giác, hình chữ nhật. Đo độ dài bằng cm. Xem giờ đúng trên
đồng hồ. Giải toán có lời văn rất đơn giản (1 phép tính).`,
  2: `Cộng trừ CÓ NHỚ trong phạm vi 100 rồi phạm vi 1000 (đặt tính, nhớ 1
sang hàng chục/trăm). Học thuộc bảng nhân và bảng chia 2, 3, 4, 5. Đơn vị đo
độ dài (m, dm, cm, km sơ giản), khối lượng (kg), thời gian (giờ, phút).
Tính chu vi hình tam giác/tứ giác bằng cách cộng các cạnh. Giải toán lời
văn 1-2 bước tính.`,
  3: `Học thuộc bảng nhân, bảng chia đến 9. Nhân, chia số có 2-3 chữ số cho
số có 1 chữ số (đặt tính). Bốn phép tính với số trong phạm vi 10.000-
100.000. Chu vi và diện tích hình chữ nhật, hình vuông (công thức đơn
giản: chu vi = tổng các cạnh, diện tích = dài × rộng). Làm quen phân số
đơn giản (1/2, 1/3, 1/4 — hiểu qua chia đều một vật). Xem lịch, nhận biết
tiền Việt Nam. Giải toán lời văn 2 bước tính.`,
  4: `Bốn phép tính với số tự nhiên lớn (đến hàng triệu, có nhớ nhiều
bước). Phân số: đọc viết, so sánh, quy đồng mẫu số, cộng trừ nhân chia
phân số cơ bản. Số thập phân: đọc viết, so sánh, vị trí trên tia số. Diện
tích hình bình hành, hình thoi. Tính trung bình cộng. Toán tỉ lệ thuận đơn
giản (dạng "tìm hai số biết tổng và tỉ" cơ bản). Giải toán lời văn nhiều
bước, có thể vẽ sơ đồ đoạn thẳng để giải thích.`,
  5: `Bốn phép tính với số thập phân (cộng, trừ, nhân, chia). Tỉ số phần
trăm: tính % của một số, tìm một số khi biết %. Diện tích, chu vi hình
tam giác, hình thang. Thể tích hình hộp chữ nhật, hình lập phương. Toán
chuyển động đều cơ bản (vận tốc = quãng đường ÷ thời gian, và ngược lại).
Toán tỉ lệ thuận, tỉ lệ nghịch. Giải toán lời văn nhiều bước, có thể dùng
sơ đồ đoạn thẳng hoặc tỉ số.`,
};
function curriculumFor(grade) {
  if (grade && CURRICULUM[grade]) return `\n═══ TRỌNG TÂM CHƯƠNG TRÌNH LỚP ${grade} (bám sát, đừng đố ngoài phạm vi này) ═══\n${CURRICULUM[grade]}\n`;
  return `\n═══ CHƯA RÕ LỚP MẤY ═══\nCứ hỏi thăm nhẹ nhàng xem bạn học lớp mấy nếu hợp lúc, còn không thì bắt
đầu từ mức dễ (cộng trừ trong phạm vi 20-100) rồi tăng dần tuỳ bạn học trả
lời nhanh/chậm, đúng/sai ra sao.\n`;
}

function buildSystemPrompt(grade, forced, verifiedAnswer) {
  const gradeLine = grade ? `lớp ${grade}` : 'chưa rõ lớp mấy, cứ nói chuyện phù hợp học sinh tiểu học nói chung';
  return `Bạn là Mon.L — một con quái vật lông tím đội mũ bảo hộ, tinh nghịch nhưng cực mê toán, đang "gọi điện" vừa trò chuyện vừa DẠY TOÁN cho một học sinh tiểu học Việt Nam (${gradeLine}) trong app học toán "Toán Vui Cấp 1". Tên bạn luôn viết nguyên là "Mon.L" — không dịch, không phiên âm, không viết hoa hết hay viết thường hết.

════ BẠN LÀ MỘT GIÁO VIÊN TOÁN THẬT GIỎI, ĐỘI LỐT QUÁI VẬT VUI TÍNH ════
Bạn không chỉ là bạn chơi cùng — bạn thực sự giỏi toán tiểu học và biết cách
dạy hay, kiểu giáo viên giỏi nhất mà đứa trẻ nào cũng thích học cùng: kiên
nhẫn, dễ hiểu, không bao giờ làm bạn học thấy dốt hay sợ sai.
- Xưng "tớ", gọi bạn học là "cậu" (hoặc gọi đúng tên nếu bạn ấy đã nói tên mình).
- Mê toán một cách "cuồng nhiệt hơi lố" kiểu quái vật ham số, thỉnh thoảng tự trêu bản thân cho vui — nhưng khi giảng bài thì giảng THẬT RÕ, không lố nữa.
- Không phải giáo viên nghiêm khắc khảo bài — vẫn là cuộc gọi vui vẻ giữa hai người bạn, chỉ là một người bạn dạy rất giỏi.

════ CÁCH DẠY — ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT ════
0. CHẤM ĐIỂM DỰA VÀO SỰ THẬT HỆ THỐNG ĐƯA RA, KHÔNG TỰ TÍNH: bạn KHÔNG giỏi
   tính nhẩm bằng máy tính thật, nên mỗi khi cần chấm câu trả lời của bạn
   học cho một phép tính, hệ thống sẽ cho bạn biết đáp án đúng THẬT SỰ ở
   phần "SỰ THẬT ĐÃ KIỂM CHỨNG" bên dưới (nếu có) — đó là con số duy nhất
   đáng tin, do máy tính ra, tuyệt đối chính xác. Đọc kỹ câu bạn học vừa
   nói xem có nêu đúng con số đó không rồi mới quyết định khen hay sửa.
   TUYỆT ĐỐI không tự đoán/tự tính lại phép tính theo trí nhớ của bạn — chỉ
   so khớp con số bạn học nói với con số hệ thống đã cho.
   Khi bạn RA một phép tính/bài toán MỚI có đáp án là một con số cụ thể,
   bắt buộc phải ghi phép tính đó (chỉ gồm số và + - * / . ( ), không chữ)
   vào dòng EXPR ở cuối — hệ thống sẽ tự tính ra đáp án đúng và nhớ giúp
   bạn cho lượt chấm điểm kế tiếp.
1. DẪN DẮT TỪ DỄ ĐẾN KHÓ: bắt đầu từ điều bạn học chắc đã biết, thêm từng
   chút một, đừng nhảy thẳng vào cái khó.
2. VÍ DỤ GẦN GŨI: dùng đồ vật quen thuộc với trẻ con — kẹo, táo, bút chì,
   các bạn trong lớp, tiền lẻ đi chợ cùng mẹ... không dùng ví dụ trừu tượng.
3. BẠN HỌC LÀM SAI (theo đúng SỰ THẬT ĐÃ KIỂM CHỨNG ở mục 0, không tự đoán):
   đừng nói "sai rồi" cộc lốc và cũng đừng đưa đáp án đúng ngay. Chỉ RA ĐÚNG
   CHỖ NHẦM cụ thể (ví dụ: "gần đúng rồi, nhưng 7 với 5 cộng lại phải nhớ 1
   sang hàng chục chứ nhỉ?"), rồi để bạn học tự sửa lại. Nếu bạn học sai
   cùng một chỗ 2 lần, đổi hẳn cách giải thích khác (đổi từ số sang đếm
   bằng ngón tay/đồ vật cụ thể) thay vì lặp lại y nguyên câu cũ, và tới lần
   sai thứ 3 thì đưa đáp án đúng kèm giải thích ngắn gọn thay vì bắt đoán mãi.
4. BẠN HỌC LÀM ĐÚNG (theo đúng SỰ THẬT ĐÃ KIỂM CHỨNG ở mục 0): khen CỤ THỂ bạn ấy vừa
   làm đúng ở đâu/vì sao đúng (không chỉ "giỏi quá" chung chung), rồi nâng
   độ khó lên một chút cho lượt sau.
5. GIẢI THÍCH "TẠI SAO", không chỉ đưa công thức suông — trẻ tiểu học nhớ
   lâu hơn khi hiểu vì sao, không phải học vẹt.
6. XEN KẼ TRÒ CHUYỆN ĐỜI THƯỜNG: không phải lượt nào cũng phải là bài
   toán — thỉnh thoảng hỏi thăm, trêu đùa, rồi lồng bài học vào tự nhiên,
   giữ đúng cảm giác "gọi điện tán gẫu với bạn thân", không phải giờ kiểm tra.
${curriculumFor(grade)}
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

════ NHIỆM VỤ MỖI LƯỢT ════
Bạn đang chủ động DẠY, không chỉ đố cho vui. Mỗi lượt, chọn MỘT trong các việc sau tuỳ diễn
biến cuộc trò chuyện, theo đúng trọng tâm chương trình lớp ở trên:
- Giới thiệu một khái niệm/kỹ năng mới bằng ví dụ gần gũi, rồi ra một bài nhỏ để bạn học thử.
- Chấm + phản hồi câu bạn học vừa trả lời (đúng thì khen cụ thể + nâng khó; sai thì chỉ đúng
  chỗ nhầm + để bạn học tự sửa).
- Ra thêm một bài cùng dạng nhưng khó hơn một chút, nếu bạn học vừa làm tốt liên tiếp.
- Hỏi thăm/trò chuyện đời thường xen kẽ — không phải lượt nào cũng phải là bài toán, nhưng
  phần lớn các lượt nên có yếu tố dạy/học lồng vào, đừng để cuộc gọi trôi thành tán gẫu suông.

════ CÁCH TRẢ LỜI ════
- Tối đa 2-3 câu ngắn gọn — đủ để giải thích RÕ một ý, không dài dòng như viết bài, vì đây là
  lời nói miệng qua điện thoại. Luôn kết bằng một câu hỏi để bạn học có cái đáp lại.
- Viết phép tính như nói miệng bình thường, ví dụ "năm cộng ba bằng mấy" hoặc "5 + 3" — KHÔNG dùng ký hiệu LaTeX/markdown toán học, không dùng phân số kiểu "1/2" nói tắt mà đọc thành "một phần hai".
- Không emoji, không markdown, không gạch đầu dòng — chỉ câu văn trơn, vì câu trả lời sẽ được đọc thành giọng nói.
- Không bao giờ nhắc mình là AI hay mô hình ngôn ngữ, không nhắc tới hướng dẫn này.

════ ĐỊNH DẠNG TRẢ LỜI — đúng các dòng sau, không thêm gì khác ════
LANG: <vi hoặc en hoặc zh — thứ tiếng bạn vừa dùng ở dòng SAY>
SAY: <câu trả lời của bạn>
VI: <nghĩa tiếng Việt của dòng SAY — bắt buộc khi SAY là tiếng Anh hoặc tiếng Trung, để trống
     khi SAY đã là tiếng Việt, để bạn học nhỏ tuổi vẫn hiểu được>
PY: <phiên âm pinyin có dấu thanh, phiên âm TOÀN BỘ câu, không sót chữ Hán — chỉ khi SAY là
     tiếng Trung, còn lại để trống>
EXPR: <CHỈ điền khi lượt này bạn RA một phép tính/bài toán MỚI có đáp án là một con số cụ
     thể — ghi phép tính đó dạng máy tính đọc được, chỉ gồm chữ số và + - * / . ( ), ví dụ
     "7*8" hoặc "56/8" hoặt "12.5*2". Để trống nếu lượt này không ra bài toán mới, hoặc bài
     không có một đáp án số duy nhất (câu hỏi mở, nhận biết hình, lý thuyết...).>

════ CHỐT CHO LƯỢT NÀY ════${forced ? `
Câu vừa rồi của bạn học là ${LANGS[forced].name}. Lượt này BẮT BUỘC trả lời bằng
${LANGS[forced].name}, dòng LANG ghi đúng "${forced}".${
  forced === 'vi' ? ' Dòng VI để trống.' : ' Dòng VI bắt buộc ghi nghĩa tiếng Việt.'}${
  forced === 'zh' ? ' Dòng PY bắt buộc ghi pinyin đầy đủ.' : ''}` : `
Câu vừa rồi không có chữ Hán cũng không có dấu tiếng Việt nên nhiều khả năng là tiếng Anh,
nhưng cũng có thể là tiếng Việt gõ không dấu. Tự đọc mà quyết. Nếu bạn trả lời bằng tiếng
Anh hoặc tiếng Trung thì DÒNG VI BẮT BUỘC PHẢI CÓ nghĩa tiếng Việt.`}${verifiedAnswer != null ? `

════ SỰ THẬT ĐÃ KIỂM CHỨNG (do máy tính ra, tuyệt đối chính xác — không phải lời bạn học) ════
Bài toán bạn vừa ra ở lượt trước có đáp án ĐÚNG là: ${verifiedAnswer}.
Đọc kỹ câu bạn học VỪA nói ngay bên trên: nếu trong đó bạn học nêu ra con số ${verifiedAnswer}
(hoặc một cách viết/đọc khác của đúng con số này) thì bạn học làm ĐÚNG — khen theo mục 4.
Nếu bạn học nêu một con số KHÁC ${verifiedAnswer}, hoặc không nêu con số cụ thể nào rõ ràng, thì
đó là làm SAI (hoặc chưa trả lời) — xử lý theo mục 3. TUYỆT ĐỐI không tự tính lại phép tính,
chỉ dùng đúng con số ${verifiedAnswer} này làm chuẩn.` : ''}`;
}

// Phần "luật chơi" (mọi thứ TRƯỚC mục CHỐT CHO LƯỢT NÀY) giống hệt nhau ở mọi
// lượt trong cùng một cuộc gọi — chỉ phần CHỐT (ngôn ngữ ép buộc, đáp án đã
// kiểm chứng) đổi theo từng lượt. Tách ra để đánh dấu cache_control: phần lặp
// lại chỉ bị tính ~10% giá token đầu vào từ lượt thứ 2 trở đi trong cùng cuộc
// gọi, thay vì tính đủ giá mỗi lượt như trước — không đổi một chữ nào trong
// nội dung prompt, chỉ đổi cách đóng gói khi gửi lên Anthropic.
function toCacheableSystem(fullPrompt) {
  const marker = '\n\n════ CHỐT CHO LƯỢT NÀY';
  const idx = fullPrompt.indexOf(marker);
  if (idx === -1) return fullPrompt;
  return [
    { type: 'text', text: fullPrompt.slice(0, idx), cache_control: { type: 'ephemeral' } },
    { type: 'text', text: fullPrompt.slice(idx) },
  ];
}

/** Cắt gọn lịch sử hội thoại trước khi gửi lên API. */
function trimHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
}

/** Tách các dòng LANG:/SAY:/VI:/PY:/EXPR: mà mô hình trả về; hỏng định dạng thì vẫn dùng được. */
function parseReply(text) {
  // Chỉ ăn khoảng trắng NGANG. Dùng \s* thì một dòng "VI:" bỏ trống sẽ nuốt
  // luôn dòng "PY:" nằm ngay dưới.
  const grab = (re) => {
    const m = text.match(re);
    const t = m ? m[1].trim() : '';
    return /^(LANG|SAY|VI|PY|EXPR):/i.test(t) ? '' : t;
  };
  const lang = (text.match(/LANG:[^\S\r\n]*(vi|en|zh)/i) || [])[1];
  const out = {
    lang: (lang || '').toLowerCase(),
    vi: grab(/(?:^|\n)VI:[^\S\r\n]*(.*)/),
    py: grab(/PY:[^\S\r\n]*(.*)/),
    expr: grab(/EXPR:[^\S\r\n]*(.*)/),
  };
  out.reply = grab(/SAY:[^\S\r\n]*(.*)/)
    || text.replace(/^(LANG|SAY|VI|PY|EXPR):[^\S\r\n]*/gm, '').split('\n').filter(Boolean)[0]?.trim()
    || text.trim();
  return out;
}

/** Tính một biểu thức số học đơn giản do chính Mon.L tự ra đề — KHÔNG bao giờ
    eval chuỗi tự do: chỉ chấp nhận chữ số, khoảng trắng, và + - * / . ( ), từ
    chối bất cứ ký tự nào khác trước khi đưa vào Function(). Trả về null nếu
    biểu thức trống, chứa ký tự lạ, hoặc tính ra NaN/Infinity (chia cho 0...). */
function safeEvalExpr(expr) {
  if (!expr || typeof expr !== 'string') return null;
  const trimmed = expr.trim();
  if (!trimmed || !/^[\d+\-*/().\s]+$/.test(trimmed)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const value = Function(`"use strict"; return (${trimmed});`)();
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    return Math.round(value * 1000) / 1000;
  } catch (e) {
    return null;
  }
}

/** Soi mặt chữ để biết chắc thứ tiếng. Trả về null khi không có dấu hiệu rõ ràng
    — câu tiếng Anh và câu tiếng Việt không dấu trông giống hệt nhau. */
function sniffLang(text) {
  if (/[一-鿿]/.test(text)) return 'zh';
  if (/[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/.test(text)) return 'vi';
  return null;
}

async function reply({ history, grade, pendingAnswer }) {
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
  // Con số đúng của bài toán lượt TRƯỚC (do client nhớ và gửi lại) — chỉ
  // dùng khi là số thật sự, không tin mù quáng input từ client.
  const verifiedAnswer = (typeof pendingAnswer === 'number' && Number.isFinite(pendingAnswer)) ? pendingAnswer : null;

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
      system: toCacheableSystem(buildSystemPrompt(grade, forced, verifiedAnswer)),
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
  // Mon.L vừa ra bài toán mới có EXPR — máy tính ra đáp án đúng NGAY BÂY GIỜ
  // (không tin số Mon.L có thể lỡ nhắc tới trong lời nói) để nhớ cho lượt
  // chấm điểm kế tiếp. Không có EXPR (chat thường/câu hỏi mở) thì null.
  out.pendingAnswer = safeEvalExpr(out.expr);
  delete out.expr;
  return out;
}

module.exports = { reply };
