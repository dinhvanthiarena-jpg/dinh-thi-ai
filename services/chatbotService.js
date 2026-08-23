const Course = require('../models/Course');
const ChatMessage = require('../models/ChatMessage');

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';
const HISTORY_LIMIT = 20;

// Signal the bot can emit inside its reply when a question needs thầy Thi
// personally (pricing negotiation, complaint, something outside course info).
// Stripped from the text shown to the customer; only used to flag the row
// in /admin so a human follow-up doesn't get missed.
const HANDOFF_MARKER = '[[HANDOFF]]';

async function buildSystemPrompt() {
  const courses = await Course.findAll({
    where: { isPublished: true },
    order: [['isFeatured', 'DESC'], ['createdAt', 'DESC']],
    limit: 30,
  });

  const courseLines = courses.length
    ? courses
        .map((c) => {
          const price = c.salePrice != null ? c.salePrice : c.price;
          const priceText = price === 0 ? 'Miễn phí' : `${price.toLocaleString('vi-VN')}đ`;
          const original = c.salePrice != null && c.salePrice !== c.price
            ? ` (giá gốc ${c.price.toLocaleString('vi-VN')}đ)`
            : '';
          return `- "${c.title}" [/khoa-hoc/${c.slug}] — ${c.category}, cấp độ ${c.level}, ${c.durationHours}h, giá ${priceText}${original}. ${c.subtitle || ''}`;
        })
        .join('\n')
    : '(Hiện chưa có khóa học nào được publish trong hệ thống.)';

  return `Bạn là trợ lý chăm sóc khách hàng AI của "Đinh Thi Ai" — nền tảng đào tạo công nghệ AI ứng dụng cho người đi làm và doanh nghiệp tại Việt Nam, do chuyên gia Đinh Thi Ai giảng dạy.

NHIỆM VỤ: Tư vấn nhiệt tình, trả lời chính xác câu hỏi của khách về khóa học, giá cả, lịch học, nội dung học, và thuyết phục khách để lại thông tin liên hệ (tên + SĐT hoặc email) hoặc đăng ký khóa học.

DANH SÁCH KHÓA HỌC ĐANG MỞ:
${courseLines}

QUY TẮC TRẢ LỜI:
1. Xưng "em". Khi CHƯA biết khách là nam hay nữ, gọi khách là "bạn" — TUYỆT ĐỐI không viết "anh/chị" ghép chung trong một câu. Nếu khách tự xưng hoặc có dấu hiệu rõ ràng cho biết giới tính, chuyển hẳn sang gọi đúng "anh" hoặc "chị" tương ứng và giữ nhất quán xưng hô đó suốt hội thoại, không quay lại "bạn" nữa. Giọng văn thân thiện, ngắn gọn, chuyên nghiệp — không lan man.
2. Chỉ tư vấn dựa trên danh sách khóa học ở trên. TUYỆT ĐỐI không bịa thông tin giá, lịch khai giảng, hay nội dung không có trong dữ liệu.
3. Nếu khách hỏi điều bot không chắc chắn (VD: đàm phán giá riêng, khiếu nại, yêu cầu đặc biệt, câu hỏi ngoài phạm vi khóa học), trả lời khéo léo rằng sẽ chuyển cho thầy Đinh Thi Ai trực tiếp hỗ trợ, và thêm chuỗi ký tự "${HANDOFF_MARKER}" ở cuối câu trả lời (chuỗi này sẽ bị ẩn khỏi khách, chỉ dùng nội bộ để báo cho thầy).
4. Khi khách có ý định đăng ký, hướng khách tới trang khóa học tương ứng hoặc form liên hệ tại /lien-he.
5. Khi tư vấn khóa học, luôn hỏi thêm khách muốn học Online hay Offline (đây là một phần thông tin cần thu thập, giống như trình độ và mục đích học). Dữ liệu khóa học ở trên không ghi rõ hình thức từng lớp, nên nếu khách hỏi cụ thể lớp nào online/offline, trả lời rằng thầy Đinh Thi Ai sẽ xác nhận hình thức phù hợp khi liên hệ trực tiếp — không tự bịa.
6. Trả lời ngắn gọn (tối đa 4-5 câu), dùng tiếng Việt tự nhiên, có thể dùng 1 emoji phù hợp nếu hợp ngữ cảnh, không lạm dụng.`;
}

async function getHistory(channel, sessionId) {
  const rows = await ChatMessage.findAll({
    where: { channel, sessionId },
    order: [['createdAt', 'DESC']],
    limit: HISTORY_LIMIT,
  });
  return rows.reverse().map((r) => ({ role: r.role, content: r.content }));
}

async function callClaude(systemPrompt, history) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      text: 'Dạ hiện hệ thống trợ lý AI đang được thầy Đinh Thi Ai cấu hình, anh/chị vui lòng để lại thông tin tại trang Liên hệ, em sẽ chuyển cho thầy phản hồi sớm nhất ạ 🙏',
      handedOff: true,
    };
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 512,
      system: systemPrompt,
      messages: history,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('[chatbotService] Anthropic API error', response.status, errText);
    return {
      text: 'Dạ em xin lỗi, hệ thống đang gặp sự cố kỹ thuật. Anh/chị vui lòng nhắn lại sau ít phút hoặc để lại thông tin tại trang Liên hệ giúp em ạ 🙏',
      handedOff: true,
    };
  }

  const data = await response.json();
  const rawText = (data.content || [])
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim();

  const handedOff = rawText.includes(HANDOFF_MARKER);
  const text = rawText.replace(HANDOFF_MARKER, '').trim();
  return { text, handedOff };
}

async function getReply({ channel, sessionId, customerName, userMessage }) {
  await ChatMessage.create({ channel, sessionId, customerName: customerName || '', role: 'user', content: userMessage });

  const [systemPrompt, history] = await Promise.all([
    buildSystemPrompt(),
    getHistory(channel, sessionId),
  ]);

  const { text, handedOff } = await callClaude(systemPrompt, history);

  await ChatMessage.create({
    channel,
    sessionId,
    customerName: customerName || '',
    role: 'assistant',
    content: text,
    handedOff,
  });

  return text;
}

module.exports = { getReply, buildSystemPrompt };
