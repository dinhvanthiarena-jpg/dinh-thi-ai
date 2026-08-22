const chatbotService = require('../services/chatbotService');

exports.sendMessage = async (req, res) => {
  const message = (req.body.message || '').toString().trim().slice(0, 2000);
  if (!message) {
    return res.status(400).json({ error: 'Vui lòng nhập nội dung.' });
  }

  const sessionId = req.session.id;
  const reply = await chatbotService.getReply({
    channel: 'web',
    sessionId,
    customerName: req.user ? req.user.name : '',
    userMessage: message,
  });

  res.json({ reply });
};
