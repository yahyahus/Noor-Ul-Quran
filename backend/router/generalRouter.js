const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware'); // For authentication
const checkRole = require('../middlewares/roleMiddleware'); // For role-based access
const { getWorkingDaysApi, fetchJuzzNames } = require('../controllers/generalController'); // Import shared logic

// Route to get working days, accessible to both teacher and admin, with role restriction
router.get('/get-working-days', getWorkingDaysApi);
router.get('/fetch-juzz-names', fetchJuzzNames);

module.exports = router;
