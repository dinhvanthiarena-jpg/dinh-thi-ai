const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const contactController = require('../controllers/contactController');
const seoController = require('../controllers/seoController');

router.get('/', homeController.index);
router.get('/gioi-thieu', homeController.about);
router.get('/lien-he', contactController.showForm);
router.post('/lien-he', contactController.submit);

router.get('/robots.txt', seoController.robots);
router.get('/sitemap.xml', seoController.sitemap);

module.exports = router;
