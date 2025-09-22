const express = require("express");
const {
  getAll,
  create,
  update,
  delete: deleteHS,
} = require("../controllers/hocsinh");
const router = express.Router();

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteHS);

module.exports = router;
