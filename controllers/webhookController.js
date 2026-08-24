const chatbotService = require('../services/chatbotService');
const facebookMessengerService = require('../services/facebookMessengerService');
const RepliedComment = require('../models/RepliedComment');
const ChatMessage = require('../models/ChatMessage');

// Only hit the Graph API for a PSID's name once — after that it's already
// saved on a prior ChatMessage row, so reuse it instead of re-fetching on
// every single incoming message.
async function resolveCustomerName(psid) {
  const existing = await ChatMessage.findOne({
    where: { channel: 'messenger', sessionId: psid },
    order: [['createdAt', 'DESC']],
  });
  if (existing && existing.customerName) return existing.customerName;

  const name = await facebookMessengerService.getUserProfile(psid);
  return name || '';
}

// Page-post "comment a keyword, get the thing in your inbox" campaigns.
// Case-insensitive substring match against the comment text.
const TOOL_KEYWORD = (process.env.FB_TOOL_KEYWORD || 'tool').toLowerCase();
const TOOL_REPLY_MESSAGE =
  process.env.FB_TOOL_REPLY_MESSAGE ||
  `Dạ em chào thầy/cô ạ! 🎉

Cảm ơn thầy/cô đã quan tâm đến bộ công cụ "Toán Học Vui Nhộn" ạ. Em xin gửi thầy/cô link tải tool bên dưới:

${process.env.FB_TOOL_LINK || ''}

Thầy/cô chỉ cần tải về, giải nén và bấm vào file exe là dùng được ngay trên máy tính để dạy học ạ.

🤖 Tiết lộ nhỏ: bộ tool này và cả tin nhắn tự động thầy/cô đang đọc đây đều được tạo ra nhờ ứng dụng công nghệ AI mới nhất — do chính thầy Đinh Thi Ai xây dựng đó ạ! Nếu thầy/cô cũng muốn tự tay làm chủ AI để soạn bài, thiết kế bài giảng, tự động hóa công việc dạy học... thầy Đinh Thi Ai đang có khóa đào tạo "Ứng dụng AI thực chiến" dành cho người đi làm, rất phù hợp với thầy/cô đó ạ. Tìm hiểu thêm tại: https://3dvietpro.com

Chúc thầy/cô có những giờ lên lớp thật vui và hiệu quả! 📚✨`;

const TOOL_PUBLIC_REPLY_MESSAGE =
  process.env.FB_TOOL_PUBLIC_REPLY_MESSAGE ||
  `Em đã gửi ạ, cảm ơn thầy/cô! Em là trợ lý ảo của thầy Đinh Thi Ai. Nếu thầy/cô muốn tìm hiểu thêm về các khóa đào tạo AI ứng dụng x100 của thầy (có cả các gói miễn phí), thầy/cô ghé web 3dvietpro.com hoặc Page Facebook để được tư vấn nhé ạ. Cảm ơn thầy/cô nhiều! 🙏`;

async function handleFeedComment(change) {
  const value = change.value || {};
  if (value.item !== 'comment' || value.verb !== 'add') return;

  const commentId = value.comment_id;
  const message = value.message || '';
  if (!commentId || !message.toLowerCase().includes(TOOL_KEYWORD)) return;

  const [, created] = await RepliedComment.findOrCreate({ where: { fbCommentId: commentId } });
  if (!created) return; // already handled (duplicate webhook delivery)

  const sent = await facebookMessengerService.sendPrivateReply(commentId, TOOL_REPLY_MESSAGE);
  if (sent) {
    console.log(`[webhookController] Auto-sent tool link for comment ${commentId}`);
    await facebookMessengerService.postPublicCommentReply(commentId, TOOL_PUBLIC_REPLY_MESSAGE);
  } else {
    // Let it be retried on the next matching webhook delivery instead of
    // silently dropping the person who asked.
    await RepliedComment.destroy({ where: { fbCommentId: commentId } });
  }
}

exports.verify = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token && token === process.env.FB_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
};

exports.receive = async (req, res) => {
  // Facebook expects a fast 200 or it will retry the same payload. Reply
  // immediately and let message processing happen after.
  res.sendStatus(200);

  if (process.env.FB_APP_SECRET) {
    const signature = req.get('x-hub-signature-256');
    if (!facebookMessengerService.isValidSignature(req.rawBody, signature)) {
      console.error('[webhookController] Invalid Messenger webhook signature, ignoring payload');
      return;
    }
  }

  const body = req.body;
  if (body.object !== 'page') return;

  for (const entry of body.entry || []) {
    for (const event of entry.messaging || []) {
      const senderPsid = event.sender && event.sender.id;
      const text = event.message && event.message.text;
      if (!senderPsid || !text || event.message.is_echo) continue;

      try {
        const customerName = await resolveCustomerName(senderPsid);
        const reply = await chatbotService.getReply({
          channel: 'messenger',
          sessionId: senderPsid,
          customerName,
          userMessage: text,
        });
        await facebookMessengerService.sendTextMessage(senderPsid, reply);
      } catch (err) {
        console.error('[webhookController] Failed to process Messenger message', err);
      }
    }

    for (const change of entry.changes || []) {
      try {
        await handleFeedComment(change);
      } catch (err) {
        console.error('[webhookController] Failed to process feed comment', err);
      }
    }
  }
};
