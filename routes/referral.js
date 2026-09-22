const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const referralController = require('../controllers/referralController');

router.use(requireAuth);
router.get('/', referralController.index);
router.post('/rut-tien', referralController.requestWithdraw);

module.exports = router;
