// src/controllers/scoreController.js

const { Score, Assignment, Student } = require("../models"); // ✅ Đường dẫn đúng

// ================================
// ADMIN GET (có thể bỏ nếu không dùng nữa)
// /api/scores/admin?class_id=&subject_id=&semester=&school_year=
// ================================
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
      ],
      order: [["student_id", "ASC"]],
    });

    res.json(scores);
  } catch (err) {
    console.error("❌ adminGetScores ERROR:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ================================
// GIÁO VIÊN XEM BẢNG ĐIỂM
// GET /api/scores/scores?class_id=&subject_id=&semester=&school_year=
// Trả về: danh sách học sinh + điểm 15ph,45ph,thi (nếu có)
// ================================
exports.getScores = async (req, res) => {
  try {
    const { class_id, subject_id, semester, school_year } = req.query;

    if (!class_id || !subject_id || !semester || !school_year) {
      return res.status(400).json({ msg: "Thiếu tham số lọc" });
    }

    // 1. Kiểm tra giáo viên có phân công lớp/môn/kỳ/năm này không
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
        .json({ msg: "Bạn không có phân công để xem điểm lớp/môn/kỳ này" });
    }

    // 2. Lấy danh sách học sinh trong lớp
    const students = await Student.findAll({
      where: { class_id },
      order: [["student_code", "ASC"]],
    });

    // 3. Lấy điểm đã nhập (nếu có)
    const scores = await Score.findAll({
      where: { class_id, subject_id, semester, school_year },
      order: [
        ["student_id", "ASC"],
        ["updated_at", "DESC"], // điểm mới nhất trước
      ],
    });

    // 4. Gom mỗi học sinh 1 điểm / loại (lấy bản ghi mới nhất nếu trùng)
    const map = {}; // { student_id: { '15ph': value, '45ph': value, 'thi': value } }

    scores.forEach((s) => {
      if (!map[s.student_id]) map[s.student_id] = {};
      // vì đã order DESC nên gặp loại nào lần đầu thì đó là bản ghi mới nhất
      if (!map[s.student_id][s.score_type]) {
        map[s.student_id][s.score_type] = parseFloat(s.score);
      }
    });

    // 5. Merge vào danh sách học sinh
    const result = students.map((st) => ({
      student_id: st.id,
      student_code: st.student_code,
      full_name: st.full_name,
      "15ph": map[st.id]?.["15ph"] ?? null,
      "45ph": map[st.id]?.["45ph"] ?? null,
      thi: map[st.id]?.["thi"] ?? null,
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ getScores (teacher) ERROR:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ================================
// GIÁO VIÊN LƯU / CẬP NHẬT ĐIỂM
// PATCH /api/scores/update
// body: { student_id, subject_id, class_id, score_type, score, semester, school_year }
// ================================
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

    if (
      !student_id ||
      !subject_id ||
      !class_id ||
      !score_type ||
      score === undefined ||
      !semester ||
      !school_year
    ) {
      return res.status(400).json({ msg: "Thiếu dữ liệu nhập điểm" });
    }

    // 1. Kiểm tra phân công của giáo viên
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

    // Lấy assignment_id cho điểm (PK mapping: assignment_id hoặc id)
    const assignment_id = assignment.assignment_id || assignment.id;

    // 2. Khóa logic: 1 bản ghi duy nhất cho mỗi (student, subject, class, type, semester, year)
    const whereKey = {
      student_id,
      subject_id,
      class_id,
      score_type,
      semester,
      school_year,
    };

    // 3. Tìm xem đã có điểm loại này chưa
    let row = await Score.findOne({ where: whereKey });

    if (row) {
      // ✅ ĐÃ CÓ → UPDATE, KHÔNG tạo bản ghi mới
      row.score = score;
      row.assignment_id = assignment_id;
      row.created_by = req.user.id; // hoặc updated_by nếu sau có thêm
      await row.save();
    } else {
      // ✅ CHƯA CÓ → CREATE
      row = await Score.create({
        ...whereKey,
        score,
        assignment_id,
        created_by: req.user.id,
      });
    }

    return res.json({
      msg: "Lưu điểm thành công",
      data: row,
    });
  } catch (err) {
    console.error("❌ updateScore (teacher) ERROR:", err);
    return res.status(500).json({ msg: err.message || "Server Error" });
  }
};
