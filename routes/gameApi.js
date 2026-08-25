const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const gameApiController = require('../controllers/gameApiController');

// One ping per app launch, generous headroom for a teacher restarting the
// game a lot while testing something.
const pingLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 60 });

router.post('/ping', pingLimiter, gameApiController.ping);

module.exports = router;
