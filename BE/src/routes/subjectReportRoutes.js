const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const teacherMiddleware = require("../middleware/teacherMiddleware");

const subjectReportController = require("../controllers/subjectReportController");

/* ============================================================
   🎓 API GIÁO VIÊN — KHÔNG bị ảnh hưởng bởi adminMiddleware
   prefix: /api/reports/teacher/subject/...
============================================================ */
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

/* ============================================================
   🛑 TỪ ĐÂY TRỞ XUỐNG CHỈ ADMIN
============================================================ */
router.use(authMiddleware, adminMiddleware);

router.get(
  "/subjects/:subjectId/summary",
  subjectReportController.getSubjectSummaryAdmin
);

router.get(
  "/subjects/:subjectId/classes",
  subjectReportController.getSubjectClassStatsAdmin
);

router.get(
  "/subjects/:subjectId/students",
  subjectReportController.getSubjectStudentStatsAdmin
);

module.exports = router;
