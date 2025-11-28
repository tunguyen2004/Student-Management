// src/routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const teacherMiddleware = require("../middleware/teacherMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const attendanceController = require("../controllers/attendanceController");

// ================== GIÁO VIÊN ==================
// GET /api/attendance/class/:classId?date=&session=
router.get(
  "/class/:classId",
  authMiddleware,
  teacherMiddleware,
  attendanceController.getClassAttendanceTeacher
);

// POST /api/attendance/mark
router.post(
  "/mark",
  authMiddleware,
  teacherMiddleware,
  attendanceController.markAttendanceTeacher
);

// ================== ADMIN ==================
// giống form assignmentRoutes: từ đây trở xuống là admin, dùng chung middleware
router.use(authMiddleware, adminMiddleware);

// ⚠️ NHỚ: bulk phải đặt TRƯỚC /admin/:id
// PATCH /api/attendance/admin/bulk
router.patch("/admin/bulk", attendanceController.bulkUpsertAttendanceAdmin);

// GET /api/attendance/admin/date?date=&session=
router.get("/admin/date", attendanceController.getAttendanceByDateAdmin);

// GET /api/attendance/admin/class/:classId?date=&session=
router.get(
  "/admin/class/:classId",
  attendanceController.getClassAttendanceAdmin
);

// GET /api/attendance/admin/student/:studentId?from=&to=
router.get(
  "/admin/student/:studentId",
  attendanceController.getStudentAttendanceHistoryAdmin
);

// PATCH /api/attendance/admin/:id
router.patch("/admin/:id", attendanceController.updateAttendanceAdmin);

// DELETE /api/attendance/admin/:id
router.delete("/admin/:id", attendanceController.deleteAttendanceAdmin);

module.exports = router;
