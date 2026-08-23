const chatbotService = require('../services/chatbotService');
const facebookMessengerService = require('../services/facebookMessengerService');

exports.verify = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.error('[webhook debug] mode=%s token=%s envToken=%s match=%s', mode, token, process.env.FB_VERIFY_TOKEN, token === process.env.FB_VERIFY_TOKEN);

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
        const reply = await chatbotService.getReply({
          channel: 'messenger',
          sessionId: senderPsid,
          customerName: '',
          userMessage: text,
        });
        await facebookMessengerService.sendTextMessage(senderPsid, reply);
      } catch (err) {
        console.error('[webhookController] Failed to process Messenger message', err);
      }
    }
  }
};
