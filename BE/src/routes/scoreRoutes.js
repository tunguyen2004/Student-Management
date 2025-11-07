const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const checkAssignment = require("../middleware/checkAssignment");
const scoreController = require("../controllers/scoreController");

router.get("/scores/class/:class_id", auth, scoreController.getScoresByClass);
router.post("/scores", auth, checkAssignment, scoreController.createScore);
router.patch("/scores/:id", auth, checkAssignment, scoreController.updateScore);
router.delete("/scores/:id", auth, scoreController.deleteScore);

module.exports = router;
