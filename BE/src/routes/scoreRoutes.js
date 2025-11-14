const express = require("express");
const router = express.Router();
const { adminGetScores } = require("../controllers/scoreController");
const scoreController = require("../controllers/scoreController");
const authMiddleware = require("../middleware/authMiddleware");
const teacherMiddleware = require("../middleware/teacherMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// router.get("/", authMiddleware, scoreController.getScores); // lấy danh sách điểm
router.get("/scores", authMiddleware, scoreController.getScores);
router.get("/admin", authMiddleware, adminMiddleware, adminGetScores);

router.patch(
  "/update",
  authMiddleware,
  teacherMiddleware,
  scoreController.updateScore
); // nhập/sửa điểm

module.exports = router;
