const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware'); // Auth Middleware
const checkRole = require('../middlewares/roleMiddleware'); // Role Middleware
const { getStudentsForTeacher, assignStudentToTeacher,markAttendance,getMonthlyAttendance } = require('../controllers/teacherController'); // Import the functions

// Route to get all students for the authenticated teacher
router.get('/get-students', authenticateToken, checkRole('teacher'), getStudentsForTeacher);
router.post('/assign-student', authenticateToken, checkRole('admin'), assignStudentToTeacher);
router.post('/mark-attendance',authenticateToken,checkRole('teacher'),markAttendance);
router.get('/get-attendance',authenticateToken,checkRole('teacher'),getMonthlyAttendance);

module.exports = router;