const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const teacherMiddleware = require("../middleware/teacherMiddleware");
const subjectReportController = require("../controllers/subjectReportController");

/* =======================================
   🎓 TEACHER ROUTES (KHÔNG QUA ADMIN)
======================================= */
router.get(
  "/teacher/subject/:subjectId/summary",
  authMiddleware,
  teacherMiddleware,
  subjectReportController.getSubjectSummaryTeacher
);

router.get(
  "/teacher/subject/:subjectId/classes",
  authMiddleware,
  teacherMiddleware,
  subjectReportController.getSubjectClassStatsTeacher
);

router.get(
  "/teacher/subject/:subjectId/students",
  authMiddleware,
  teacherMiddleware,
  subjectReportController.getSubjectStudentStatsTeacher
);

/* =======================================
   🟥 ADMIN ROUTES
======================================= */
router.get(
  "/subjects/:subjectId/summary",
  authMiddleware,
  adminMiddleware,
  subjectReportController.getSubjectSummaryAdmin
);

router.get(
  "/subjects/:subjectId/classes",
  authMiddleware,
  adminMiddleware,
  subjectReportController.getSubjectClassStatsAdmin
);

router.get(
  "/subjects/:subjectId/students",
  authMiddleware,
  adminMiddleware,
  subjectReportController.getSubjectStudentStatsAdmin
);

module.exports = router;
