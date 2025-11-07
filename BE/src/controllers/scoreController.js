const { Score, Student, Subject, Class, Assignment } = require("../models");

exports.createScore = async (req, res) => {
  try {
    req.body.created_by = req.user.id;
    const score = await Score.create(req.body);

    res.status(201).json(score);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getScoresByClass = async (req, res) => {
  const { class_id } = req.params;
  const { subject_id, semester, school_year } = req.query;

  try {
    const scores = await Score.findAll({
      include: [
        {
          model: Student,
          where: { class_id },
          attributes: ["full_name", "student_code"],
        },
        { model: Subject, attributes: ["subject_name"] },
      ],
      where: { subject_id, semester, school_year },
    });

    res.json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.updateScore = async (req, res) => {
  const { id } = req.params;
  try {
    await Score.update(req.body, { where: { id } });
    res.json({ msg: "Cập nhật điểm thành công" });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

exports.deleteScore = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Chỉ admin được xóa điểm" });
  }
  try {
    await Score.destroy({ where: { id: req.params.id } });
    res.json({ msg: "Đã xóa điểm" });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};
