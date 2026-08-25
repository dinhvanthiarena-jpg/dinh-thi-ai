const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');

router.get('/', toolController.list);
router.get('/:slug', toolController.show);
router.get('/:slug/download', toolController.download);

module.exports = router;
