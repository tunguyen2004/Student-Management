const express = require("express");
const router = express.Router();

const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getStudentsForTeacher, // ✅ QUAN TRỌNG: phải import hàm này
} = require("../controllers/teacherController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const teacherMiddleware = require("../middleware/teacherMiddleware");

// ✅ Route teacher-specific (KHÔNG bị chặn bởi adminMiddleware)
router.get(
  "/students",
  authMiddleware,
  teacherMiddleware,
  getStudentsForTeacher
);

// -----------------------------
// 🔒 ADMIN ROUTES (áp dụng sau)
// -----------------------------
router.use(authMiddleware, adminMiddleware);

// @route   GET api/teachers
router.get("/", getAllTeachers);

// @route   GET api/teachers/:id
router.get("/:id", getTeacherById);

// @route   POST api/teachers
router.post("/", createTeacher);

// @route   PATCH api/teachers/:id
router.patch("/:id", updateTeacher);

// @route   DELETE api/teachers/:id
router.delete("/:id", deleteTeacher);

module.exports = router;
