require('dotenv').config();
const { Op } = require('sequelize');
const connectDB = require('../config/db');
const ChatMessage = require('../models/ChatMessage');
const facebookMessengerService = require('../services/facebookMessengerService');

async function run() {
  await connectDB();

  const sessions = await ChatMessage.findAll({
    where: { channel: 'messenger' },
    attributes: ['sessionId'],
    group: ['sessionId'],
  });

  for (const { sessionId } of sessions) {
    const hasName = await ChatMessage.findOne({
      where: { channel: 'messenger', sessionId, customerName: { [Op.ne]: '' } },
    });
    if (hasName) continue;

    const name = await facebookMessengerService.getUserProfile(sessionId);
    if (!name) {
      console.log('no name found for', sessionId);
      continue;
    }

    const [count] = await ChatMessage.update(
      { customerName: name },
      { where: { channel: 'messenger', sessionId } }
    );
    console.log(`updated ${count} message(s) for ${sessionId} -> ${name}`);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
