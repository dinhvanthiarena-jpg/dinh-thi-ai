const crypto = require('crypto');

const GRAPH_API_URL = 'https://graph.facebook.com/v19.0/me/messages';

// Messenger text messages render no markdown, so the [label](/path) and
// **bold** syntax the chatbot prompt is instructed to use (for the web
// widget's own renderer) has to be turned into something a plain-text
// message actually shows: the full absolute URL (Messenger auto-links
// plain URLs) followed by the label, and bold markers just stripped.
function formatForMessenger(text) {
  const appUrl = (process.env.APP_URL || 'https://3dvietpro.com').replace(/\/$/, '');
  const withLinks = text.replace(/\[([^\]]+)\]\((\/[^\s)]*|https?:\/\/[^\s)]+)\)/g, (match, label, url) => {
    const absoluteUrl = url.startsWith('http') ? url : `${appUrl}${url}`;
    return `${label}: ${absoluteUrl}`;
  });
  return withLinks.replace(/\*\*([^*]+)\*\*/g, '$1');
}

async function sendTextMessage(recipientPsid, text) {
  const pageToken = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!pageToken) {
    console.error('[facebookMessengerService] Missing FB_PAGE_ACCESS_TOKEN, cannot send reply');
    return;
  }

  const formatted = formatForMessenger(text);

  // Messenger caps a single text message at 2000 chars.
  const chunks = formatted.match(/[\s\S]{1,1900}/g) || [formatted];

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

// Sends a Messenger DM in reply to a specific Page-post comment, using the
// comment's own id rather than a PSID — this is the one Send API path Meta
// allows outside the normal 24h messaging window, meant exactly for "comment
// a keyword to get something in your inbox" campaigns.
async function sendPrivateReply(commentId, text) {
  const pageToken = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!pageToken) {
    console.error('[facebookMessengerService] Missing FB_PAGE_ACCESS_TOKEN, cannot send private reply');
    return false;
  }

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${commentId}/private_replies?access_token=${encodeURIComponent(pageToken)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: text }),
    }
  );
  if (!res.ok) {
    console.error('[facebookMessengerService] Private reply error', res.status, await res.text());
    return false;
  }
  return true;
}

// Public follow-up under the original comment, so anyone browsing the post
// sees the person was already helped (Meta's own auto-reply UI calls this
// the "Trả lời bình luận" — it's separate from the private_replies DM above).
async function postPublicCommentReply(commentId, text) {
  const pageToken = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!pageToken) {
    console.error('[facebookMessengerService] Missing FB_PAGE_ACCESS_TOKEN, cannot post public reply');
    return false;
  }

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${commentId}/comments?access_token=${encodeURIComponent(pageToken)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: text }),
    }
  );
  if (!res.ok) {
    console.error('[facebookMessengerService] Public comment reply error', res.status, await res.text());
    return false;
  }
  return true;
}

// Meta doesn't expose a public profile URL for a page-scoped id (PSID) —
// only first/last name and picture — for privacy reasons. first_name/
// last_name still require the person to have messaged the Page recently.
async function getUserProfile(psid) {
  const pageToken = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!pageToken) return null;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${psid}?fields=first_name,last_name&access_token=${encodeURIComponent(pageToken)}`
    );
    if (!res.ok) {
      console.error('[facebookMessengerService] getUserProfile error', res.status, await res.text());
      return null;
    }
    const data = await res.json();
    const name = [data.first_name, data.last_name].filter(Boolean).join(' ');
    return name || null;
  } catch (err) {
    console.error('[facebookMessengerService] getUserProfile failed', err);
    return null;
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

module.exports = { sendTextMessage, sendPrivateReply, postPublicCommentReply, getUserProfile, isValidSignature };
