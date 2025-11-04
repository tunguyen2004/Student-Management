
const express = require('express');
const router = express.Router();
const { 
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Apply auth and admin middleware to all routes in this file
router.use(authMiddleware, adminMiddleware);

// @route   GET api/teachers
// @desc    Get all teachers
// @access  Admin
router.get('/', getAllTeachers);

// @route   GET api/teachers/:id
// @desc    Get a single teacher by user ID
// @access  Admin
router.get('/:id', getTeacherById);

// @route   POST api/teachers
// @desc    Create a new teacher
// @access  Admin
router.post('/', createTeacher);

// @route   PUT api/teachers/:id
// @desc    Update a teacher by user ID
// @access  Admin
router.put('/:id', updateTeacher);

// @route   DELETE api/teachers/:id
// @desc    Delete a teacher by user ID
// @access  Admin
router.delete('/:id', deleteTeacher);

module.exports = router;
