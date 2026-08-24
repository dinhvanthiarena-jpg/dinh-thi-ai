const TELEGRAM_API_URL = 'https://api.telegram.org';

// Telegram's plain "text" messages don't render markdown either (and its
// MarkdownV2 mode requires escaping a long list of special characters just
// to send a URL), so — same as the Messenger channel — turn the widget's
// [label](/path) and **bold** syntax into something a plain message shows
// correctly: the full absolute URL (Telegram auto-links plain URLs) plus
// the label, with bold markers stripped.
function formatForTelegram(text) {
  const appUrl = (process.env.APP_URL || 'https://3dvietpro.com').replace(/\/$/, '');
  const withLinks = text.replace(/\[([^\]]+)\]\((\/[^\s)]*|https?:\/\/[^\s)]+)\)/g, (match, label, url) => {
    const absoluteUrl = url.startsWith('http') ? url : `${appUrl}${url}`;
    return `${label}: ${absoluteUrl}`;
  });
  return withLinks.replace(/\*\*([^*]+)\*\*/g, '$1');
}

async function sendMessage(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('[telegramService] Missing TELEGRAM_BOT_TOKEN, cannot send reply');
    return;
  }

  const formatted = formatForTelegram(text);

  // Telegram caps a single message at 4096 chars.
  const chunks = formatted.match(/[\s\S]{1,4000}/g) || [formatted];

  for (const chunk of chunks) {
    const res = await fetch(`${TELEGRAM_API_URL}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: chunk }),
    });
    if (!res.ok) {
      console.error('[telegramService] sendMessage error', res.status, await res.text());
    }
  }
}

// Registers the webhook URL with Telegram. Called once at server startup —
// idempotent, Telegram just re-confirms the same URL if it's unchanged —
// so no manual "set webhook" step is needed after each deploy.
async function ensureWebhook() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.APP_URL;
  if (!token || !appUrl) return;

  const webhookUrl = `${appUrl.replace(/\/$/, '')}/tg-events/webhook`;
  try {
    const res = await fetch(`${TELEGRAM_API_URL}/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: process.env.TELEGRAM_WEBHOOK_SECRET || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      console.error('[telegramService] setWebhook failed', data);
    } else {
      console.log(`[telegramService] Webhook registered at ${webhookUrl}`);
    }
  } catch (err) {
    console.error('[telegramService] setWebhook error', err);
  }
}

module.exports = { sendMessage, ensureWebhook };
