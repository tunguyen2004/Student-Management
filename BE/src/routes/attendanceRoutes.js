const express = require('express');
const router = express.Router();
const {
    getAttendanceByClass,
    getAttendanceByStudent,
    takeAttendance,
    updateAttendance,
} = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Apply auth and admin middleware to all routes in this file
router.use(authMiddleware, adminMiddleware);

router.get('/class/:class_id', getAttendanceByClass);
router.get('/student/:student_id', getAttendanceByStudent);
router.post('/', takeAttendance);
router.put('/:id', updateAttendance);

module.exports = router;
