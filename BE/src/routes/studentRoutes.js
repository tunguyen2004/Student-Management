const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass,
} = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Apply auth and admin middleware to all routes in this file
router.use(authMiddleware, adminMiddleware);

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.patch("/:id", updateStudent);
router.delete("/:id", deleteStudent);

router.get("/class/:class_id", getStudentsByClass);

module.exports = router;
