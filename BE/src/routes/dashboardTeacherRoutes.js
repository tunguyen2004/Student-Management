const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const teacherMiddleware = require("../middleware/teacherMiddleware");
const dashboardTeacherController = require("../controllers/dashboardTeacherController");

router.get(
  "/dashboard",
  authMiddleware,
  teacherMiddleware,
  dashboardTeacherController.getTeacherDashboard
);

module.exports = router;
