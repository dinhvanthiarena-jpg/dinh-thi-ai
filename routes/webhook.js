const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.get('/messenger', webhookController.verify);
router.post('/messenger', webhookController.receive);

module.exports = router;
