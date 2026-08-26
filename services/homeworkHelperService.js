// Explains a photographed math homework problem using Google Gemini's free
// tier (separate API key/billing from the Anthropic-powered chatbot). Calls
// the REST API directly via https, no SDK dependency — same pattern as
// chatbotService.js uses for Anthropic.
const https = require('https');

const GEMINI_MODEL = 'gemini-2.5-flash';

function buildPrompt(strugglingMode) {
  const base = `Bạn là một giáo viên tiểu học giỏi, tận tâm, đang dạy kèm 1-1 cho học sinh Việt Nam từ lớp 1 đến lớp 5. Nhìn vào bài tập toán trong ảnh và:
1. Đọc lại đúng đề bài trong ảnh (nếu chữ viết tay khó đọc, đoán ý hợp lý nhất, ghi rõ nếu không chắc).
2. Giải thích cách làm THEO TỪNG BƯỚC, dễ hiểu, có ví dụ minh hoạ nếu cần.
3. Đưa ra đáp số cuối cùng rõ ràng, in đậm.
4. Nếu có cách tính nhanh/mẹo hay phù hợp với bài này, hãy chỉ thêm ở cuối.
Trả lời bằng tiếng Việt, giọng điệu ấm áp, khích lệ, xưng "thầy/cô", gọi học sinh là "con". Nếu ảnh không phải bài toán hoặc không đọc được, hãy nói rõ và nhẹ nhàng nhắc chụp lại.`;
  const strugglingExtra = `

QUAN TRỌNG: học sinh này bị MẤT GỐC (yếu kiến thức cơ bản) — hãy giảng CỰC KỲ chậm rãi, chia nhỏ từng bước nhỏ nhất có thể, giải thích cả những khái niệm nền tảng nhất liên quan (ví dụ: phép cộng/trừ là gì, hàng chục hàng đơn vị là gì...), không bỏ qua bước nào dù nhỏ, dùng từ ngữ đơn giản nhất, có thể lấy ví dụ đồ vật quen thuộc (kẹo, quả táo, ngón tay...) để minh hoạ cho dễ hình dung.`;
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
    generationConfig: { temperature: 0.4, maxOutputTokens: 2048 },
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
