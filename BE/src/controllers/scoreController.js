const { Score, Assignment, Student, User } = require("../models");

exports.adminGetScores = async (req, res) => {
  try {
    const { class_id, subject_id, semester, school_year } = req.query;
    const where = {};

    if (class_id) where.class_id = class_id;
    if (subject_id) where.subject_id = subject_id;
    if (semester) where.semester = semester;
    if (school_year) where.school_year = school_year;

    const scores = await Score.findAll({
      where,
      include: [
        {
          model: Student,
          attributes: ["student_code", "full_name", "class_id"],
        },
        { model: Assignment, include: ["Teacher", "Subject"] },
      ],
      order: [["student_id", "ASC"]],
    });

    res.json(scores);
  } catch (err) {
    console.error("❌ adminGetScores ERROR:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getScores = async (req, res) => {
  try {
    const { class_id, subject_id, semester, school_year } = req.query;

    const scores = await Score.findAll({
      where: { class_id, subject_id, semester, school_year },
      include: [{ model: Student, attributes: ["student_code", "full_name"] }],
      order: [["student_id", "ASC"]],
    });

    res.json(scores);
  } catch (err) {
    console.error("❌ getScores ERROR:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.updateScore = async (req, res) => {
  try {
    const {
      student_id,
      subject_id,
      class_id,
      score_type,
      score,
      semester,
      school_year,
    } = req.body;

    // ✅ Tìm phân công giảng dạy tương ứng
    const assignment = await Assignment.findOne({
      where: {
        teacher_id: req.user.teacher_id,
        class_id,
        subject_id,
        semester,
        school_year,
      },
    });

    if (!assignment) {
      return res
        .status(403)
        .json({ msg: "Bạn không được nhập điểm lớp/môn/kỳ này" });
    }

    // ✅ Update hoặc Insert (UP SERT)
    const [savedScore] = await Score.upsert({
      student_id,
      subject_id,
      class_id, // 🔥 thêm vào model để upsert đúng
      assignment_id: assignment.assignment_id,
      score_type,
      score,
      semester,
      school_year,
      created_by: req.user.id,
    });

    return res.json({
      msg: "✅ Lưu điểm thành công",
      score: savedScore,
    });
  } catch (err) {
    console.error("❌ updateScore ERROR:", err);
    return res.status(500).json({ msg: err.message || "Server Error" });
  }
};
