// // src/controllers/adminScoreController.js
// const {
//   Score,
//   Assignment,
//   Student,
//   User,
//   Class,
//   Subject,
//   Teacher,
// } = require("../models");

// // ================================
// // LẤY DANH SÁCH LỚP
// // ================================
// exports.getClasses = async (req, res) => {
//   try {
//     const classes = await Class.findAll({ order: [["class_name", "ASC"]] });
//     res.json(classes);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// // ================================
// // LẤY DANH SÁCH MÔN
// // ================================
// exports.getSubjects = async (req, res) => {
//   try {
//     const subjects = await Subject.findAll({
//       order: [["subject_name", "ASC"]],
//     });
//     res.json(subjects);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// // ================================
// // LẤY BẢNG ĐIỂM
// // ================================
// // GET scores (admin view)
// exports.getScores = async (req, res) => {
//   try {
//     const { class_id, subject_id, semester, school_year } = req.query;

//     // 1) Lấy danh sách học sinh trong lớp
//     const students = await Student.findAll({
//       where: { class_id },
//       include: [{ model: User, attributes: ["full_name"] }],
//       order: [["student_code", "ASC"]],
//     });

//     // 2) Lấy điểm (nếu có)
//     const scores = await Score.findAll({
//       where: { class_id, subject_id, semester, school_year },
//       include: [
//         {
//           model: Assignment,
//           include: [
//             { model: Subject },
//             { model: Teacher, include: [{ model: User }] },
//           ],
//         },
//       ],
//     });

//     // 3) Gom điểm theo học sinh
//     const scoreMap = {};

//     scores.forEach((s) => {
//       if (!scoreMap[s.student_id])
//         scoreMap[s.student_id] = { "15ph": [], "45ph": [], thi: [] };

//       scoreMap[s.student_id][s.score_type].push({
//         id: s.id,
//         score: s.score,
//       });
//     });

//     // 4) Merge: học sinh + điểm
//     const result = students.map((st) => ({
//       student_id: st.id,
//       student_code: st.student_code,
//       student_name: st.User.full_name,
//       class_id,
//       subject_id,
//       scores: scoreMap[st.id] || { "15ph": [], "45ph": [], thi: [] },
//     }));

//     res.json(result);
//   } catch (err) {
//     console.error("admin.getScores ERR", err);
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// // ================================
// // LẤY 1 ĐIỂM (cho modal sửa)
// // ================================
// exports.getScoreById = async (req, res) => {
//   try {
//     const score = await Score.findByPk(req.params.id, {
//       include: [{ model: Student }, { model: Assignment }],
//     });

//     if (!score) return res.status(404).json({ msg: "Score not found" });

//     res.json(score);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// // ================================
// // UPDATE hoặc CREATE.
// // Không còn upsert gây nhân bản!
// // ================================
// exports.upsertScore = async (req, res) => {
//   try {
//     const {
//       id,
//       student_id,
//       subject_id,
//       class_id,
//       score_type,
//       score,
//       semester,
//       school_year,
//     } = req.body;

//     const assignment = await Assignment.findOne({
//       where: { class_id, subject_id, semester, school_year },
//     });

//     if (!assignment) {
//       return res
//         .status(400)
//         .json({ msg: "Không tìm thấy phân công tương ứng" });
//     }

//     // ===== CASE 1: UPDATE (Nếu có ID) =====
//     if (id) {
//       await Score.update({ score, score_type }, { where: { id } });
//       return res.json({ msg: "Cập nhật điểm thành công" });
//     }

//     // ===== CASE 2: CREATE MỚI =====
//     await Score.create({
//       student_id,
//       subject_id,
//       class_id,
//       assignment_id: assignment.assignment_id || assignment.id,
//       score_type,
//       score,
//       semester,
//       school_year,
//       created_by: req.user.id,
//     });

//     return res.json({ msg: "Thêm điểm mới thành công" });
//   } catch (err) {
//     console.error("admin.upsertScore ERR", err);
//     res.status(500).json({ msg: err.message || "Server Error" });
//   }
// };

// // ================================
// // EXPORT CSV
// // ================================
// exports.exportCSV = async (req, res) => {
//   try {
//     const { class_id, subject_id, semester, school_year } = req.query;

//     const rows = await Score.findAll({
//       where: { class_id, subject_id, semester, school_year },
//       include: [
//         { model: Student },
//         {
//           model: Assignment,
//           include: [
//             { model: Teacher, include: [{ model: User }] },
//             { model: Subject },
//           ],
//         },
//       ],
//       order: [["student_id", "ASC"]],
//     });

//     const grouped = {};
//     rows.forEach((r) => {
//       const sid = r.student_id;

//       if (!grouped[sid]) {
//         grouped[sid] = {
//           code: r.Student.student_code,
//           name: r.Student.full_name,
//           "15ph": [],
//           "45ph": [],
//           thi: [],
//         };
//       }

//       grouped[sid][r.score_type].push(r.score);
//     });

//     const csv = [["Mã HS", "Họ tên", "15 phút", "45 phút", "Thi", "TB Môn"]];

//     Object.values(grouped).forEach((s) => {
//       const avg = (
//         avgOf(s["15ph"]) * 0.3 +
//         avgOf(s["45ph"]) * 0.3 +
//         avgOf(s["thi"]) * 0.4
//       ).toFixed(2);

//       csv.push([
//         s.code,
//         s.name,
//         s["15ph"].join("|"),
//         s["45ph"].join("|"),
//         s["thi"].join("|"),
//         avg,
//       ]);
//     });

//     // Xuất file
//     const content = csv.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");

//     res.setHeader("Content-Type", "text/csv; charset=utf-8");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="scores_${class_id}_${subject_id}_${semester}_${school_year}.csv"`
//     );

//     res.send("\uFEFF" + content);
//   } catch (err) {
//     console.error("admin.exportCSV ERR", err);
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// function avgOf(arr) {
//   if (!arr || arr.length === 0) return 0;
//   return arr.reduce((a, b) => a + parseFloat(b), 0) / arr.length;
// }

// src/controllers/adminScoreController.js
const {
  Score,
  Assignment,
  Student,
  User,
  Class,
  Subject,
  Teacher,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");
const stringify = require("csv-stringify"); // npm i csv-stringify (optional) or build CSV manually

// GET classes for filter (admin)
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({ order: [["class_name", "ASC"]] });
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      order: [["subject_name", "ASC"]],
    });
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// GET scores (admin view)
// GET scores (admin view)
exports.getScores = async (req, res) => {
  try {
    const { class_id, subject_id, semester, school_year } = req.query;

    // 1) lấy danh sách học sinh trước
    const students = await Student.findAll({
      where: { class_id },
      order: [["student_code", "ASC"]],
    });

    // 2) lấy điểm
    const scores = await Score.findAll({
      where: { class_id, subject_id, semester, school_year },
    });

    // 3) group điểm theo student_id
    const grouped = {};
    scores.forEach((s) => {
      if (!grouped[s.student_id]) grouped[s.student_id] = {};
      if (!grouped[s.student_id][s.score_type])
        grouped[s.student_id][s.score_type] = [];
      grouped[s.student_id][s.score_type].push(s.score);
    });

    // 4) merge vào danh sách học sinh
    const result = students.map((st) => ({
      student_id: st.id,
      student_code: st.student_code,
      full_name: st.full_name,
      "15ph": grouped[st.id]?.["15ph"] || [],
      "45ph": grouped[st.id]?.["45ph"] || [],
      thi: grouped[st.id]?.["thi"] || [],
    }));

    res.json(result);
  } catch (err) {
    console.error("admin.getScores ERR", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// GET single score (optional)
exports.getScoreById = async (req, res) => {
  try {
    const score = await Score.findByPk(req.params.id, {
      include: [{ model: Student }, { model: Assignment }],
    });
    if (!score) return res.status(404).json({ msg: "Score not found" });
    res.json(score);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// PATCH /api/admin/scores/update
exports.upsertScore = async (req, res) => {
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

    // 1. Tìm phân công tương ứng
    const assignment = await Assignment.findOne({
      where: { class_id, subject_id, semester, school_year },
    });

    // Nếu có phân công → lấy assignment_id
    // Nếu không có → assignment_id = null (admin vẫn chấp nhận)
    let assignment_id = assignment
      ? assignment.assignment_id || assignment.id
      : null;

    // Nếu user là teacher thì phải có phân công
    if (!assignment && req.user.role === "teacher") {
      return res.status(400).json({
        msg: "Giáo viên không có phân công để nhập điểm môn này!",
      });
    }

    // 2. Khóa logic để xác định mỗi ô điểm là duy nhất
    const whereKey = {
      student_id,
      subject_id,
      class_id,
      score_type,
      semester,
      school_year,
    };

    // 3. Tìm xem đã có điểm hay chưa
    let row = await Score.findOne({ where: whereKey });

    if (row) {
      // ❗ ĐÃ CÓ → UPDATE
      row.score = score;
      row.assignment_id = assignment_id;
      row.created_by = req.user.id;
      await row.save();
    } else {
      // ❗ CHƯA CÓ → CREATE
      row = await Score.create({
        ...whereKey,
        assignment_id,
        score,
        created_by: req.user.id,
      });
    }

    return res.json({ msg: "Lưu điểm thành công", data: row });
  } catch (err) {
    console.error("admin.upsertScore ERR", err);
    return res.status(500).json({ msg: err.message || "Server Error" });
  }
};

// EXPORT CSV
exports.exportCSV = async (req, res) => {
  try {
    const { class_id, subject_id, semester, school_year } = req.query;
    const rows = await Score.findAll({
      where: { class_id, subject_id, semester, school_year },
      include: [
        { model: Student },
        {
          model: Assignment,
          include: [
            { model: Teacher, include: [{ model: User }] },
            { model: Subject },
          ],
        },
      ],
      order: [["student_id", "ASC"]],
    });

    // build CSV rows grouped by student and score_type
    const grouped = {};
    rows.forEach((r) => {
      const sid = r.student_id;
      if (!grouped[sid])
        grouped[sid] = {
          student_code: r.Student.student_code,
          student_name: r.Student.full_name,
          "15ph": [],
          "45ph": [],
          thi: [],
        };
      grouped[sid][r.score_type].push(r.score);
    });

    const csvRows = [["Mã HS", "Họ tên", "15ph", "45ph", "Thi", "TB môn"]];

    Object.values(grouped).forEach((g) => {
      const avg = (
        avgOf(g["15ph"]) * 0.3 +
        avgOf(g["45ph"]) * 0.3 +
        avgOf(g["thi"]) * 0.4
      ).toFixed(2);
      csvRows.push([
        g.student_code,
        g.student_name,
        g["15ph"].join("|"),
        g["45ph"].join("|"),
        g["thi"].join("|"),
        avg,
      ]);
    });

    // stringfy
    const content = csvRows
      .map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="scores_${class_id}_${subject_id}_${semester}_${school_year}.csv"`
    );
    res.send("\uFEFF" + content); // BOM for Excel UTF-8
  } catch (err) {
    console.error("admin.exportCSV ERR", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

function avgOf(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + parseFloat(b), 0) / arr.length;
}
