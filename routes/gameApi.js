const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const gameApiController = require('../controllers/gameApiController');

// One ping per app launch, generous headroom for a teacher restarting the
// game a lot while testing something.
const pingLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 60 });

// Homework photos never touch disk or become web-accessible — memory
// storage only, buffer is discarded after the Gemini call completes.
const homeworkUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 },
});
// Free-tier Gemini has its own rate limits; this caps abuse from one IP
// well below that so one class doesn't starve everyone else.
const homeworkLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 30 });

// A student's own device subscribing/unsubscribing — cheap, but still capped
// well above any real usage pattern to block abuse.
const pushLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 30 });

// One call turn per mic/typed answer — generous enough for a real
// conversation, capped well below what would meaningfully burn tokens.
const boomChatLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 40 });

router.post('/ping', pingLimiter, gameApiController.ping);
router.post('/homework-help', homeworkLimiter, homeworkUpload.single('image'), gameApiController.homeworkHelp);
router.get('/vapid-public-key', gameApiController.vapidPublicKey);
router.post('/push-subscribe', pushLimiter, gameApiController.pushSubscribe);
router.post('/push-unsubscribe', pushLimiter, gameApiController.pushUnsubscribe);
router.post('/boom-chat', boomChatLimiter, gameApiController.boomChat);

module.exports = router;
