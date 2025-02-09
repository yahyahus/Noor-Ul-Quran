const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const { getAttendance, viewProgress , getTodayProgress, getWeeklyProgress, getCurrentJuzzInfo} = require('../controllers/studentController');



router.get('/attendance', authenticateToken, checkRole('student'), getAttendance);
router.get('/view-progress', authenticateToken, checkRole('student'), viewProgress);
router.get('/today-progress', authenticateToken, checkRole('student'), getTodayProgress);
router.get('/weekly-progress', authenticateToken, checkRole('student'), getWeeklyProgress);
router.get('/current-juzz', authenticateToken, checkRole('student'), getCurrentJuzzInfo);
module.exports = router;
    