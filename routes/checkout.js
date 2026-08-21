const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { requireAuth } = require('../middleware/auth');

router.get('/mock-pay/:orderId', requireAuth, checkoutController.mockPayPage);
router.post('/mock-pay/:orderId/confirm', requireAuth, checkoutController.mockPayConfirm);

module.exports = router;
