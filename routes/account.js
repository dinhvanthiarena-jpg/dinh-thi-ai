const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const accountController = require('../controllers/accountController');

router.use(requireAuth);
router.get('/', accountController.showSettings);
router.post('/', accountController.updateProfile);
router.post('/mat-khau', accountController.updatePassword);
router.get('/thanh-toan', accountController.showPayment);
router.post('/thanh-toan', accountController.updatePayment);

module.exports = router;
