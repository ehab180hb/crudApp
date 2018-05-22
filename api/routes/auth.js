const express = require('express');
const router = express.Router();
const { signUp, signIn, secret } = require('../controllers/auth');

const validate = require('../handlers/auth/validation');

router.route('/signup').post(validate('auth'), signUp);
router.route('/signin').post(signIn);
router.route('/secret').get(secret);

module.exports = router;