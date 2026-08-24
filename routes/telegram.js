const express = require('express');
const router = express.Router();
const telegramController = require('../controllers/telegramController');

router.post('/webhook', telegramController.receive);

module.exports = router;
