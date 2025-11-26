// src/routes/scoreRoutes.js
const express = require("express");
const router = express.Router();

const scoreController = require("../controllers/scoreController");
const authMiddleware = require("../middleware/authMiddleware");
const teacherMiddleware = require("../middleware/teacherMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware"); // nếu không dùng nữa có thể bỏ

// GIÁO VIÊN XEM BẢNG ĐIỂM
// GET /api/scores/scores?class_id=&subject_id=&semester=&school_year=
router.get(
  "/scores",
  authMiddleware,
  teacherMiddleware,
  scoreController.getScores
);

// (tuỳ, nếu FE cũ còn dùng /api/scores/admin thì giữ lại)
// router.get("/admin", authMiddleware, adminMiddleware, scoreController.adminGetScores);

// GIÁO VIÊN NHẬP / SỬA ĐIỂM
// PATCH /api/scores/update
router.patch(
  "/update",
  authMiddleware,
  teacherMiddleware,
  scoreController.updateScore
);

module.exports = router;
