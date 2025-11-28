const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const teacher = require("../middleware/teacherMiddleware");
const reportCtrl = require("../controllers/reportController");

/* ------------------ ADMIN ------------------ */
router.get(
  "/class/:classId/overview",
  auth,
  admin,
  reportCtrl.getClassOverview
);

router.get(
  "/class/:classId/students",
  auth,
  admin,
  reportCtrl.getClassStudentScores
);

/* ------------------ GIÁO VIÊN ------------------ */
router.get(
  "/teacher/class/:classId/overview",
  auth,
  teacher,
  reportCtrl.getClassOverview
);

router.get(
  "/teacher/class/:classId/students",
  auth,
  teacher,
  reportCtrl.getClassStudentScores
);

module.exports = router;
