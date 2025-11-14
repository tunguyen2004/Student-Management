const express = require("express");
const router = express.Router();

const {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  bulkAssignTeachers,
  getFreeSlots,
  validateAssignment,
  getAssignmentsForTeacher,
} = require("../controllers/assignmentController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const teacherMiddleware = require("../middleware/teacherMiddleware");

// ✅ Route dành cho giáo viên — KHÔNG ĐẶT SAU adminMiddleware
router.get(
  "/teacher",
  authMiddleware,
  teacherMiddleware,
  getAssignmentsForTeacher
);

router.get("/free-slots", getFreeSlots);
router.post("/validate", validateAssignment);
// ============================
// ✅ Từ đây trở xuống là route Admin
// ============================
router.use(authMiddleware, adminMiddleware);

router.get("/", getAllAssignments);
router.post("/", createAssignment);
router.post("/bulk", bulkAssignTeachers);
router.get("/:id", getAssignmentById);
router.put("/:id", updateAssignment);
router.delete("/:id", deleteAssignment);

module.exports = router;
