const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const checkoutController = require('../controllers/checkoutController');
const { requireAuth } = require('../middleware/auth');

router.get('/', courseController.list);
router.get('/:slug', courseController.show);

router.get('/:slug/checkout', requireAuth, checkoutController.showCheckout);
router.post('/:slug/checkout', requireAuth, checkoutController.startPayment);

module.exports = router;
