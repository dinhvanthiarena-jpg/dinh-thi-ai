const crypto = require('crypto');

const GRAPH_API_URL = 'https://graph.facebook.com/v19.0/me/messages';

async function sendTextMessage(recipientPsid, text) {
  const pageToken = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!pageToken) {
    console.error('[facebookMessengerService] Missing FB_PAGE_ACCESS_TOKEN, cannot send reply');
    return;
  }

  // Messenger caps a single text message at 2000 chars.
  const chunks = text.match(/[\s\S]{1,1900}/g) || [text];

  for (const chunk of chunks) {
    const res = await fetch(`${GRAPH_API_URL}?access_token=${encodeURIComponent(pageToken)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientPsid },
        message: { text: chunk },
        messaging_type: 'RESPONSE',
      }),
    });
    if (!res.ok) {
      console.error('[facebookMessengerService] Send API error', res.status, await res.text());
    }
  }
}

function isValidSignature(rawBody, signatureHeader) {
  const appSecret = process.env.FB_APP_SECRET;
  if (!appSecret || !signatureHeader || !rawBody) return false;

  const expected = 'sha256=' + crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = { sendTextMessage, isValidSignature };
