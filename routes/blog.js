const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.list);
router.get('/api/recommended', blogController.recommended);
router.get('/:slug', blogController.show);

module.exports = router;
