const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 회원가입 라우트
router.post('/signup', authController.signup);

// 로그인 라우트
router.post('/login', authController.login);

module.exports = router;