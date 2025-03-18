const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware'); // Auth Middleware
const checkRole = require('../middlewares/roleMiddleware'); // Role Middleware
const { getStudentsForTeacher, assignStudentToTeacher,markAttendance,getMonthlyAttendance ,markSabaq,markSabqi,markManzil,getMonthlyProgress ,getStudentsProgressForDate} = require('../controllers/teacherController'); // Import the functions

// Route to get all students for the authenticated teacher
router.get('/get-students', authenticateToken, checkRole('teacher'), getStudentsForTeacher);
router.post('/assign-student', authenticateToken, checkRole('admin'), assignStudentToTeacher);
router.post('/mark-attendance',authenticateToken,checkRole('teacher'),markAttendance);
router.get('/get-attendance',authenticateToken,checkRole('teacher'),getMonthlyAttendance);
router.post('/mark-sabaq',authenticateToken,checkRole('teacher'),markSabaq);
router.post('/mark-sabqi',authenticateToken,checkRole('teacher'),markSabqi);
router.post('/mark-manzil',authenticateToken,checkRole('teacher'),markManzil);
router.get('/get-progress',authenticateToken,checkRole('teacher'),getMonthlyProgress);
router.get('/get-student-progress',authenticateToken,checkRole('teacher'),getStudentsProgressForDate);


module.exports = router;