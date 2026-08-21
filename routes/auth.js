const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/auth');

router.get('/register', redirectIfAuthenticated, authController.showRegister);
router.post(
  '/register',
  redirectIfAuthenticated,
  [
    body('name').trim().notEmpty().withMessage('Vui long nhap ho ten.'),
    body('email').isEmail().withMessage('Email khong hop le.'),
    body('password').isLength({ min: 6 }).withMessage('Mat khau toi thieu 6 ky tu.'),
  ],
  authController.register
);

router.get('/login', redirectIfAuthenticated, authController.showLogin);
router.post('/login', redirectIfAuthenticated, authController.login);

router.post('/logout', authController.logout);

module.exports = router;
