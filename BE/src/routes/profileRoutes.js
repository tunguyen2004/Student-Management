
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMyProfile, updateMyProfile } = require('../controllers/profileController');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', authMiddleware, getMyProfile);

// @route   PUT api/profile/me
// @desc    Update current user's profile
// @access  Private
router.put('/me', authMiddleware, updateMyProfile);

module.exports = router;
