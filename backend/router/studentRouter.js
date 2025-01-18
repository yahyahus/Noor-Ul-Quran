const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const { getAttendance, viewProgress } = require('../controllers/studentController');



router.get('/attendance', authenticateToken, checkRole('student'), getAttendance);
router.get('/view-progress', authenticateToken, checkRole('student'), viewProgress);
module.exports = router;
