const express = require('express');
const router = express.Router();
const { login, register, portal } = require('../controllers/authController');
const checkAuth = require('../middleware/authMiddleware');
const validateRegister = require('../utils/validation');

router.post('/login', login);
router.post('/register', validateRegister, register);
router.get('/portal', checkAuth, portal);

module.exports = router;
