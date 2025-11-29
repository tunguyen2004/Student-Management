const express = require("express");
const router = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const reportController = require("../controllers/reportController");
const teacherMiddleware = require("../middleware/teacherMiddleware");

// ROUTE CHO GIÁO VIÊN
router.get(
  "/teacher/class/:classId/summary",
  authMiddleware,
  teacherMiddleware,
  reportController.getClassSummary
);

router.get(
  "/teacher/class/:classId/subjects",
  authMiddleware,
  teacherMiddleware,
  reportController.getSubjectStats
);

router.get(
  "/teacher/class/:classId/students",
  authMiddleware,
  teacherMiddleware,
  reportController.getStudentStats
);

router.use(authMiddleware, adminMiddleware);

// SUMMARY
router.get("/class/:classId/summary", reportController.getClassSummary);

// SUBJECT STATS
router.get("/class/:classId/subjects", reportController.getSubjectStats);

// STUDENT STATS
router.get("/class/:classId/students", reportController.getStudentStats);

module.exports = router;
// Removed duplicate block
