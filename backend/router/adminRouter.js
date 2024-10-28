const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware'); 
const { getUnassignedStudents , getTeachers, assignStudent, addHoliday} = require('../controllers/adminController');
router.get('/unassigned-students', authenticateToken, checkRole('admin'), getUnassignedStudents);
router.get('/get-teachers', authenticateToken, checkRole('admin'), getTeachers);
router.post('/assign-student', authenticateToken, checkRole('admin'), assignStudent);
router.post('/add-holiday',addHoliday );


module.exports = router;

