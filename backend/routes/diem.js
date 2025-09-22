const express = require("express");
const { addScore, getByHocSinh } = require("../controllers/diem");
const router = express.Router();

router.post("/", addScore);
router.get("/:hoc_sinh_id", getByHocSinh);

module.exports = router;
