const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const battleController = require('../controllers/battleController');

const profileLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });

router.get('/profile', profileLimiter, battleController.profile);

module.exports = router;
