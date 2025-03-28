const express = require('express');
const router = express.Router();
const { login, register, isLoggedIn,logout } = require('../controllers/authController');
const {validateRegister} = require('../utils/validation');
const {authenticateToken} = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/register', validateRegister, register);
router.get('/isloggedin', authenticateToken, isLoggedIn);
router.post('/logout', logout);

module.exports = router;








