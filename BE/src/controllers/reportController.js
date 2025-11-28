const db = require("../models");
const { sequelize } = db;
const { QueryTypes } = require("sequelize");

/* -------------------------------------------
   1. OVERVIEW: Tổng quan học tập của lớp
------------------------------------------- */
exports.getClassOverview = async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);
    const semester = req.query.semester || 1;
    const schoolYear = req.query.school_year;

    if (!classId || !schoolYear)
      return res
        .status(400)
        .json({ message: "Thiếu classId hoặc school_year" });

    // Tổng số học sinh
    const totalStudents = await sequelize.query(
      `SELECT COUNT(*) AS total FROM students WHERE class_id = ?`,
      { replacements: [classId], type: QueryTypes.SELECT }
    );

    // GPA từng học sinh
    const gpas = await sequelize.query(
      `
      SELECT 
        s.id AS student_id,
        AVG(sc.score) AS gpa
      FROM students s
      LEFT JOIN scores sc 
        ON sc.student_id = s.id 
        AND sc.semester = ? 
        AND sc.school_year = ?
      WHERE s.class_id = ?
      GROUP BY s.id
      `,
      {
        replacements: [semester, schoolYear, classId],
        type: QueryTypes.SELECT,
      }
    );

    // GPA trung bình lớp
    const classGPA =
      gpas.reduce((acc, g) => acc + (g.gpa || 0), 0) / gpas.length || 0;

    // Phân loại học lực
    const rating = {
      gioi: 0,
      kha: 0,
      trung_binh: 0,
      yeu: 0,
      kem: 0,
    };

    gpas.forEach((g) => {
      const gpa = g.gpa || 0;
      if (gpa >= 8) rating.gioi++;
      else if (gpa >= 6.5) rating.kha++;
      else if (gpa >= 5) rating.trung_binh++;
      else if (gpa >= 3.5) rating.yeu++;
      else rating.kem++;
    });

    // Điểm TB theo từng môn
    const subjectStats = await sequelize.query(
      `
      SELECT 
        sub.id AS subject_id,
        sub.subject_name,
        AVG(sc.score) AS avg_score
      FROM subjects sub
      LEFT JOIN scores sc ON sc.subject_id = sub.id
        AND sc.semester = ?
        AND sc.school_year = ?
      JOIN students s ON s.id = sc.student_id AND s.class_id = ?
      GROUP BY sub.id
      `,
      {
        replacements: [semester, schoolYear, classId],
        type: QueryTypes.SELECT,
      }
    );

    return res.json({
      class_id: classId,
      total_students: totalStudents[0].total,
      gpa_average: Number(classGPA.toFixed(2)),
      rating_distribution: rating,
      subjects: subjectStats,
    });
  } catch (error) {
    console.error("getClassOverview error:", error);
    return res.status(500).json({ message: "Lỗi server khi thống kê" });
  }
};

/* -------------------------------------------
   2. Danh sách học sinh + bảng điểm tổng hợp
------------------------------------------- */
exports.getClassStudentScores = async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);
    const semester = req.query.semester || 1;
    const schoolYear = req.query.school_year;

    if (!classId || !schoolYear)
      return res
        .status(400)
        .json({ message: "Thiếu classId hoặc school_year" });

    // Load danh sách học sinh
    const students = await sequelize.query(
      `SELECT id, student_code, full_name 
       FROM students WHERE class_id = ? ORDER BY full_name`,
      { replacements: [classId], type: QueryTypes.SELECT }
    );

    // Load bảng điểm chi tiết
    const scoreRows = await sequelize.query(
      `
      SELECT
        s.id AS student_id,
        sub.id AS subject_id,
        sub.subject_name,
        AVG(sc.score) AS avg_score
      FROM students s
      JOIN subjects sub
      LEFT JOIN scores sc 
        ON sc.student_id = s.id
        AND sc.subject_id = sub.id
        AND sc.semester = ?
        AND sc.school_year = ?
      WHERE s.class_id = ?
      GROUP BY s.id, sub.id
      ORDER BY s.full_name
      `,
      {
        replacements: [semester, schoolYear, classId],
        type: QueryTypes.SELECT,
      }
    );

    // Gộp theo học sinh
    const result = students.map((st) => {
      const subjects = scoreRows
        .filter((r) => r.student_id === st.id)
        .map((r) => ({
          subject_id: r.subject_id,
          subject_name: r.subject_name,
          avg: Number((r.avg_score || 0).toFixed(2)),
        }));

      const gpa =
        subjects.reduce((acc, s) => acc + s.avg, 0) / subjects.length || 0;

      return {
        student_id: st.id,
        student_code: st.student_code,
        full_name: st.full_name,
        scores: subjects,
        gpa: Number(gpa.toFixed(2)),
      };
    });

    // Xếp hạng
    result.sort((a, b) => b.gpa - a.gpa);
    result.forEach((st, index) => (st.rank = index + 1));

    return res.json(result);
  } catch (error) {
    console.error("getClassStudentScores error:", error);
    return res.status(500).json({ message: "Lỗi server khi lấy bảng điểm" });
  }
};
