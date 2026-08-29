const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const analyticsController = require('../controllers/analyticsController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(requireAuth, requireAdmin);
router.use((req, res, next) => {
  res.locals.layout = 'layouts/admin';
  next();
});

router.get('/', adminController.dashboard);
router.get('/analytics', analyticsController.dashboard);

router.get('/courses', adminController.courseList);
router.get('/courses/new', adminController.courseNewForm);
router.post('/courses', upload.single('thumbnail'), upload.processImage({ maxWidth: 1280 }), adminController.courseCreate);
router.get('/courses/:id/edit', adminController.courseEditForm);
router.post('/courses/:id', upload.single('thumbnail'), upload.processImage({ maxWidth: 1280 }), adminController.courseUpdate);
router.post('/courses/:id/delete', adminController.courseDelete);

router.post('/courses/:id/lessons', adminController.lessonCreate);
router.post('/courses/:id/lessons/:lessonId/delete', adminController.lessonDelete);

router.get('/blog', adminController.blogList);
router.get('/blog/new', adminController.blogNewForm);
router.post('/blog', upload.single('cover'), upload.processImage({ maxWidth: 1280 }), adminController.blogCreate);
router.get('/blog/:id/edit', adminController.blogEditForm);
router.post('/blog/:id', upload.single('cover'), upload.processImage({ maxWidth: 1280 }), adminController.blogUpdate);
router.post('/blog/:id/delete', adminController.blogDelete);

router.get('/orders', adminController.orderList);
router.get('/pro-orders', adminController.proOrderList);
router.post('/pro-orders/:id/confirm', adminController.proOrderConfirm);
router.get('/students', adminController.studentList);

router.get('/messages', adminController.messageList);
router.post('/messages/:id/read', adminController.messageMarkRead);

router.get('/game-installs', adminController.gameInstallList);

router.get('/push-broadcast', adminController.pushBroadcastForm);
router.post('/push-broadcast', adminController.pushBroadcastSend);

router.get('/chats', adminController.chatList);
router.get('/chats/:channel/:sessionId', adminController.chatDetail);

router.get('/gallery', adminController.galleryList);
router.get('/gallery/new', adminController.galleryNewForm);
router.post('/gallery', upload.array('images', 20), upload.processImage({ maxWidth: 1920 }), adminController.galleryCreate);
router.get('/gallery/:id/edit', adminController.galleryEditForm);
router.post('/gallery/:id', upload.single('image'), upload.processImage({ maxWidth: 1920 }), adminController.galleryUpdate);
router.post('/gallery/:id/delete', adminController.galleryDelete);

const toolUpload = upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'gallery', maxCount: 20 },
]);
router.get('/tools', adminController.toolList);
router.get('/tools/new', adminController.toolNewForm);
router.post('/tools', toolUpload, upload.processImage({ maxWidth: 1920 }), adminController.toolCreate);
router.get('/tools/:id/edit', adminController.toolEditForm);
router.post('/tools/:id', toolUpload, upload.processImage({ maxWidth: 1920 }), adminController.toolUpdate);
router.post('/tools/:id/delete', adminController.toolDelete);

module.exports = router;
