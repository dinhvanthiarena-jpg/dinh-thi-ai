const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', dashboardController.index);
router.get('/learn/:slug', dashboardController.learn);
router.post('/learn/:slug/lesson/:lessonId/complete', dashboardController.completeLesson);
router.post('/learn/:slug/review', dashboardController.submitReview);

module.exports = router;
