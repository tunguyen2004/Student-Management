// const express = require("express");
// const router = express.Router();

// const {
//   getAllClasses,
//   getAllSubjects,
//   getScoresAdmin,
//   adminUpdateScore,
// } = require("../controllers/adminScoreController");

// const authMiddleware = require("../middleware/authMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");

// // CHỈ ADMIN ĐƯỢC DÙNG
// router.use(authMiddleware, adminMiddleware);

// // Dropdown
// router.get("/classes", getAllClasses);
// router.get("/subjects", getAllSubjects);

// // Lấy bảng điểm
// router.get("/", getScoresAdmin);

// // Admin sửa điểm
// router.patch("/update", adminUpdateScore);

// module.exports = router;

// src/routes/adminScoresRoutes.js
const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/adminScoreController");

// chỉ admin được gọi các route này
router.use(authMiddleware, adminMiddleware);

router.get("/classes", controller.getClasses);
router.get("/subjects", controller.getSubjects);

router.get("/", controller.getScores); // GET /api/admin/scores
router.get("/:id", controller.getScoreById); // GET /api/admin/scores/:id
router.patch("/update", controller.upsertScore); // PATCH /api/admin/scores/update
router.get("/export", controller.exportCSV); // GET /api/admin/scores/export

module.exports = router;
