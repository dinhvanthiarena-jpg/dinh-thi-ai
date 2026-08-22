const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const chatController = require('../controllers/chatController');

const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });

router.post('/message', chatLimiter, chatController.sendMessage);

module.exports = router;
