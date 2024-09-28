const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware'); 
const { getUnassignedStudents , getTeachers, assignStudent} = require('../controllers/adminController');
router.get('/unassigned-students', authenticateToken, checkRole('admin'), getUnassignedStudents);
router.get('/get-teachers', authenticateToken, checkRole('admin'), getTeachers);
router.post('/assign-student', authenticateToken, checkRole('admin'), assignStudent);

module.exports = router;

