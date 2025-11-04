const express = require('express');
const router = express.Router();
const {
    getAllAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    bulkAssignTeachers,
} = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Apply auth and admin middleware to all routes in this file
router.use(authMiddleware, adminMiddleware);

router.get('/', getAllAssignments);
router.get('/:id', getAssignmentById);
router.post('/', createAssignment);
router.post('/bulk', bulkAssignTeachers);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

module.exports = router;
