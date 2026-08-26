// Explains a photographed math homework problem using Google Gemini's free
// tier (separate API key/billing from the Anthropic-powered chatbot). Calls
// the REST API directly via https, no SDK dependency — same pattern as
// chatbotService.js uses for Anthropic.
const https = require('https');

const GEMINI_MODEL = 'gemini-3.6-flash';

// Splits the model's reply into "slides" the student taps/swipes through
// one at a time instead of reading one long wall of text.
const STEP_DELIMITER = '%%%STEP%%%';

function buildPrompt(strugglingMode) {
  const base = `Bạn là một giáo viên tiểu học giỏi, tận tâm, đang dạy kèm 1-1 cho học sinh Việt Nam từ lớp 1 đến lớp 5. Nhìn vào bài tập toán trong ảnh và giảng bài đó THẬT KỸ, THẬT ĐẦY ĐỦ, giống như đang ngồi cạnh kèm con từng ly từng tí — không được giảng qua loa, sơ sài hay rút gọn.

QUAN TRỌNG VỀ CÁCH VIẾT PHÉP TÍNH — TUYỆT ĐỐI KHÔNG dùng ký hiệu LaTeX/markdown toán học (không dùng dấu $, không dùng \\frac, \\text, dấu ^, dấu _, dấu ngoặc nhọn {}). Hãy viết phép tính như viết tay bình thường ra vở, ví dụ:
- Phân số: viết "3 và 5/9" hoặc "5/9" (không viết \\frac{5}{9})
- Số mũ/đơn vị vuông: dùng ký tự ² thật, ví dụ "5 m²", "25 dm²" (không viết m^2 hay \\text{m}^2)
- So sánh: dùng thẳng dấu >, <, = (ví dụ: 3 5/9 > 2 7/9)
- Có thể dùng các icon/ký hiệu toán học Unicode cho sinh động và dễ nhìn: + − × ÷ = ✓ ✗ ★ 👉

Nếu bài có NHIỀU Ý/CÂU NHỎ (ví dụ câu 1, 2, 3... hoặc a, b, c...), PHẢI giảng giải LẦN LƯỢT TỪNG Ý MỘT, đầy đủ không bỏ sót ý nào, mỗi ý giải thích rõ ràng vì sao đúng/vì sao sai (không chỉ ghi đáp án Đ/S mà không giải thích).

Cấu trúc câu trả lời thành nhiều BƯỚC NHỎ để con đọc từng bước một, không bị rối:
- Bước 1: đọc lại đúng đề bài trong ảnh (nếu chữ viết tay khó đọc, đoán ý hợp lý nhất và ghi rõ nếu không chắc).
- Các bước tiếp theo: giảng cách làm CHI TIẾT. Nếu bài có nhiều ý nhỏ, MỖI Ý NHỎ LÀ ÍT NHẤT MỘT BƯỚC RIÊNG (bài có 6 ý thì ít nhất 6 bước giảng, đừng dồn nhiều ý vào 1 bước). Mỗi bước giải thích cặn kẽ, có ví dụ minh hoạ nếu cần, không rút gọn.
- Bước áp chót (nếu có): cách tính nhanh/mẹo hay phù hợp với bài này.
- Bước cuối cùng: tổng kết đáp số cuối cùng của TẤT CẢ các ý, in đậm, kèm một câu khích lệ động viên con.

QUAN TRỌNG VỀ ĐỊNH DẠNG: giữa các bước, chèn ĐÚNG NGUYÊN VĂN dòng phân cách sau trên một dòng riêng, không thêm số thứ tự hay chữ "Bước" vào dòng phân cách đó:
${STEP_DELIMITER}

Ví dụ cấu trúc: <nội dung bước 1>\n${STEP_DELIMITER}\n<nội dung bước 2>\n${STEP_DELIMITER}\n<nội dung bước cuối>

Trả lời bằng tiếng Việt, giọng điệu ấm áp, khích lệ, xưng "thầy/cô", gọi học sinh là "con". Nếu ảnh không phải bài toán hoặc không đọc được, hãy nói rõ và nhẹ nhàng nhắc chụp lại (không cần chia bước trong trường hợp này).`;
  const strugglingExtra = `

QUAN TRỌNG: học sinh này bị MẤT GỐC (yếu kiến thức cơ bản) — hãy giảng CỰC KỲ chậm rãi, chia thành CÀNG NHIỀU BƯỚC CÀNG TỐT (mỗi bước chỉ một ý nhỏ nhất có thể), giải thích cả những khái niệm nền tảng nhất liên quan (ví dụ: phép cộng/trừ là gì, hàng chục hàng đơn vị là gì...), không bỏ qua bước nào dù nhỏ, dùng từ ngữ đơn giản nhất, có thể lấy ví dụ đồ vật quen thuộc (kẹo, quả táo, ngón tay...) để minh hoạ cho dễ hình dung.`;
  return base + (strugglingMode ? strugglingExtra : '');
}

function explainHomeworkPhoto({ imageBase64, mimeType, strugglingMode }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Promise.reject(new Error('GEMINI_API_KEY chưa được cấu hình trên server.'));
  }

  const payload = JSON.stringify({
    contents: [
      {
        parts: [
          { text: buildPrompt(strugglingMode) },
          { inline_data: { mime_type: mimeType, data: imageBase64 } },
        ],
      },
    ],
    generationConfig: { temperature: 0.4, maxOutputTokens: 8192 },
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
        timeout: 30000,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          let json;
          try {
            json = JSON.parse(body);
          } catch (e) {
            return reject(new Error('Gemini trả về dữ liệu không hợp lệ.'));
          }
          if (res.statusCode !== 200) {
            return reject(new Error((json.error && json.error.message) || `Gemini API lỗi (${res.statusCode})`));
          }
          const parts = (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts) || [];
          const text = parts.map((p) => p.text || '').join('').trim();
          if (!text) return reject(new Error('Gemini không trả về nội dung.'));
          resolve(text);
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('Gemini API timeout')));
    req.write(payload);
    req.end();
  });
}

module.exports = { explainHomeworkPhoto };
