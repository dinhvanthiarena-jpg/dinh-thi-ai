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
