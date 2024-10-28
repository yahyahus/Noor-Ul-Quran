const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const { getAttendance } = require('../controllers/studentController');


router.get('/attendance', authenticateToken, checkRole('student'), getAttendance);
module.exports = router;
