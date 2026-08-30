const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authCtrl = require('../controllers/authController');

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], authCtrl.register);

router.post('/login', [body('email').isEmail(), body('password').exists()], authCtrl.login);

module.exports = router;
