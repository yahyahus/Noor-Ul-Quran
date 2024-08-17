const express = require('express');
const router = express.Router();
const { login, register, portal,logout } = require('../controllers/authController');
const validateRegister = require('../utils/validation');

router.post('/login', login);
router.post('/register', validateRegister, register);
router.get('/portal', portal);
router.post('/logout', logout);

module.exports = router;
