const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(requireAuth, requireAdmin);
router.use((req, res, next) => {
  res.locals.layout = 'layouts/admin';
  next();
});

router.get('/', adminController.dashboard);

router.get('/courses', adminController.courseList);
router.get('/courses/new', adminController.courseNewForm);
router.post('/courses', upload.single('thumbnail'), adminController.courseCreate);
router.get('/courses/:id/edit', adminController.courseEditForm);
router.post('/courses/:id', upload.single('thumbnail'), adminController.courseUpdate);
router.post('/courses/:id/delete', adminController.courseDelete);

router.post('/courses/:id/lessons', adminController.lessonCreate);
router.post('/courses/:id/lessons/:lessonId/delete', adminController.lessonDelete);

router.get('/blog', adminController.blogList);
router.get('/blog/new', adminController.blogNewForm);
router.post('/blog', upload.single('cover'), adminController.blogCreate);
router.get('/blog/:id/edit', adminController.blogEditForm);
router.post('/blog/:id', upload.single('cover'), adminController.blogUpdate);
router.post('/blog/:id/delete', adminController.blogDelete);

router.get('/orders', adminController.orderList);
router.get('/students', adminController.studentList);

router.get('/messages', adminController.messageList);
router.post('/messages/:id/read', adminController.messageMarkRead);

router.get('/gallery', adminController.galleryList);
router.get('/gallery/new', adminController.galleryNewForm);
router.post('/gallery', upload.single('image'), adminController.galleryCreate);
router.get('/gallery/:id/edit', adminController.galleryEditForm);
router.post('/gallery/:id', upload.single('image'), adminController.galleryUpdate);
router.post('/gallery/:id/delete', adminController.galleryDelete);

module.exports = router;
