const chatbotService = require('../services/chatbotService');
const telegramService = require('../services/telegramService');

exports.receive = async (req, res) => {
  // If a secret token is configured, Telegram echoes it back on every
  // request in this header — reject anything that doesn't match so a
  // stranger who finds the URL can't feed the bot fake conversations.
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret && req.get('x-telegram-bot-api-secret-token') !== expectedSecret) {
    return res.sendStatus(403);
  }

  // Telegram expects a fast 200 or it will retry the same update.
  res.sendStatus(200);

  // Nút bấm "Đã nhận tiền" của đăng ký tool Sa Muse Ai — CHỈ chat admin được bấm.
  const cb = req.body && req.body.callback_query;
  if (cb) {
    try {
      const adminChat = String(process.env.TELEGRAM_ADMIN_CHAT || '');
      const fromChat = String(cb.message && cb.message.chat && cb.message.chat.id);
      const m = /^muse_paid:(\d+)$/.exec(cb.data || '');
      if (!adminChat || fromChat !== adminChat || !m) {
        await telegramService.answerCallbackQuery(cb.id, 'Không hợp lệ');
        return;
      }
      const museReg = require('../services/museRegistrationService');
      const r = await museReg.xacNhanDaNhanTien(m[1]);
      let msg;
      if (r.loi) msg = r.loi;
      else if (r.daXuLyTruoc) msg = `Đã xử lý trước đó: ${r.reg.name} (key ${r.reg.licenseKey})`;
      else if (r.daGuiMail) msg = `✅ Đã gửi key cho ${r.reg.name} qua ${r.reg.email}`;
      else msg = `⚠️ Đã cấp key ${r.reg.licenseKey} cho ${r.reg.name} nhưng GỬI MAIL LỖI: ${r.loiMail}. Vào /admin/dang-ky-muse bấm Gửi lại.`;
      await telegramService.answerCallbackQuery(cb.id, 'Xong');
      await telegramService.sendMessage(adminChat, msg);
    } catch (err) {
      console.error('[telegramController] callback error', err);
    }
    return;
  }

  const message = req.body && req.body.message;
  const chatId = message && message.chat && message.chat.id;
  const text = message && message.text;
  if (!chatId || !text) return;

  try {
    const reply = await chatbotService.getReply({
      channel: 'telegram',
      sessionId: String(chatId),
      customerName: (message.from && message.from.first_name) || '',
      userMessage: text,
    });
    await telegramService.sendMessage(chatId, reply);
  } catch (err) {
    console.error('[telegramController] Failed to process Telegram message', err);
  }
};
