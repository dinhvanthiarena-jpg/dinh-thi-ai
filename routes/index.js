const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const contactController = require('../controllers/contactController');

router.get('/', homeController.index);
router.get('/gioi-thieu', homeController.about);
router.get('/lien-he', contactController.showForm);
router.post('/lien-he', contactController.submit);

module.exports = router;
