const { Assignment } = require("../models");

module.exports = async (req, res, next) => {
  if (req.user.role === "admin") return next(); // admin bypass

  const { class_id, subject_id } = req.body;

  const assigned = await Assignment.findOne({
    where: { class_id, subject_id, teacher_id: req.user.Teacher.id },
  });

  if (!assigned) {
    return res.status(403).json({
      msg: "Bạn không được phân công môn này. Không thể nhập điểm.",
    });
  }

  next();
};
