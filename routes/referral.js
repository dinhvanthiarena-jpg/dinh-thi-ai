const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { requireAuth } = require('../middleware/auth');
const referralController = require('../controllers/referralController');

// Chống spam/brute-force vào 2 API có thể bị lạm dụng: rút tiền (thử rút
// nhiều lần liên tiếp) và tạo link tracking (spam tạo hàng loạt link rác).
const referralActionLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

router.use(requireAuth);
router.get('/', referralController.index);
router.post('/rut-tien', referralActionLimiter, referralController.requestWithdraw);
router.post('/links', referralActionLimiter, referralController.createLink);

module.exports = router;
