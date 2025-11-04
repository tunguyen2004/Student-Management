const express = require('express');
const router = express.Router();
const {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Apply auth and admin middleware to all routes in this file
router.use(authMiddleware, adminMiddleware);

// @route   GET api/subjects
// @desc    Get all subjects
// @access  Admin
router.get('/', getAllSubjects);

// @route   GET api/subjects/:id
// @desc    Get a single subject by ID
// @access  Admin
router.get('/:id', getSubjectById);

// @route   POST api/subjects
// @desc    Create a new subject
// @access  Admin
router.post('/', createSubject);

// @route   PUT api/subjects/:id
// @desc    Update a subject by ID
// @access  Admin
router.put('/:id', updateSubject);

// @route   DELETE api/subjects/:id
// @desc    Delete a subject by ID
// @access  Admin
router.delete('/:id', deleteSubject);

module.exports = router;
