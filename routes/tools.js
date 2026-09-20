const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');
const { requireAuth } = require('../middleware/auth');

router.get('/', toolController.list);
router.get('/:slug', toolController.show);
router.get('/:slug/download', toolController.download);
router.post('/:slug/mua', requireAuth, toolController.buy);

module.exports = router;
