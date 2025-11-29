//`src/controllers/reportController.js
const db = require("../models");
const { sequelize } = db;
const { QueryTypes } = require("sequelize");

exports.getClassSummary = async (req, res) => {
  try {
    const classId = req.params.classId;
    const semester = req.query.semester || null;
    const schoolYear = req.query.school_year || null;

    if (!classId)
      return res.status(400).json({ message: "classId là bắt buộc" });

    // ===== LẤY SĨ SỐ ====
    const [{ total }] = await sequelize.query(
      "SELECT COUNT(*) AS total FROM students WHERE class_id = ?",
      { replacements: [classId], type: QueryTypes.SELECT }
    );

    // ===== LẤY TỔNG ĐIỂM TB CỦA LỚP =====
    const avgQuery = `
      SELECT AVG(score) AS avg_score 
      FROM scores 
      WHERE class_id = ?
      ${semester ? "AND semester = ?" : ""}
      ${schoolYear ? "AND school_year = ?" : ""}
    `;

    const avgParams =
      semester && schoolYear
        ? [classId, semester, schoolYear]
        : semester
        ? [classId, semester]
        : schoolYear
        ? [classId, schoolYear]
        : [classId];

    const [{ avg_score }] = await sequelize.query(avgQuery, {
      replacements: avgParams,
      type: QueryTypes.SELECT,
    });

    // ===== XẾP LOẠI =====
    const rankQuery = `
      SELECT 
        SUM(CASE WHEN avg >= 8 THEN 1 ELSE 0 END) AS gioi_count,
        SUM(CASE WHEN avg >= 6.5 AND avg < 8 THEN 1 ELSE 0 END) AS kha_count,
        SUM(CASE WHEN avg >= 5 AND avg < 6.5 THEN 1 ELSE 0 END) AS tb_count,
        SUM(CASE WHEN avg < 5 THEN 1 ELSE 0 END) AS yeu_count
      FROM (
        SELECT student_id, AVG(score) AS avg
        FROM scores
        WHERE class_id = ?
        ${semester ? "AND semester = ?" : ""}
        ${schoolYear ? "AND school_year = ?" : ""}
        GROUP BY student_id
      ) AS t;
    `;

    const rankParams = avgParams;

    const rankData = await sequelize.query(rankQuery, {
      replacements: rankParams,
      type: QueryTypes.SELECT,
    });

    const r = rankData[0];

    const result = {
      total_students: total,
      avg_score: Number(avg_score || 0),

      gioi_count: r.gioi_count,
      kha_count: r.kha_count,
      tb_count: r.tb_count,
      yeu_count: r.yeu_count,

      gioi_rate: (r.gioi_count / total) * 100,
      kha_rate: (r.kha_count / total) * 100,
      tb_rate: (r.tb_count / total) * 100,
      yeu_rate: (r.yeu_count / total) * 100,
    };

    return res.json({ data: result });
  } catch (err) {
    console.error("getClassSummary error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getSubjectStats = async (req, res) => {
  try {
    const classId = req.params.classId;
    const semester = req.query.semester || null;
    const schoolYear = req.query.school_year || null;

    const query = `
      SELECT 
        s.subject_id,
        sub.subject_name,
        AVG(s.score) AS avg_score,
        MAX(s.score) AS highest_score,
        MIN(s.score) AS lowest_score,
        SUM(CASE WHEN s.score >= 5 THEN 1 ELSE 0 END) / COUNT(*) * 100 AS pass_rate
      FROM scores s
      JOIN subjects sub ON sub.id = s.subject_id
      WHERE s.class_id = ?
      ${semester ? "AND s.semester = ?" : ""}
      ${schoolYear ? "AND s.school_year = ?" : ""}
      GROUP BY s.subject_id;
    `;

    const params =
      semester && schoolYear
        ? [classId, semester, schoolYear]
        : semester
        ? [classId, semester]
        : schoolYear
        ? [classId, schoolYear]
        : [classId];

    const rows = await sequelize.query(query, {
      replacements: params,
      type: QueryTypes.SELECT,
    });

    return res.json({ data: rows });
  } catch (err) {
    console.error("getSubjectStats error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
exports.getStudentStats = async (req, res) => {
  try {
    const classId = req.params.classId;
    const semester = req.query.semester || null;
    const schoolYear = req.query.school_year || null;

    const query = `
      SELECT 
        st.id AS student_id,
        st.student_code,
        st.full_name,
        AVG(sc.score) AS avg_score,
        CASE 
          WHEN AVG(sc.score) >= 8 THEN 'Giỏi'
          WHEN AVG(sc.score) >= 6.5 THEN 'Khá'
          WHEN AVG(sc.score) >= 5 THEN 'Trung bình'
          ELSE 'Yếu'
        END AS rating,
        (
          SELECT sub.subject_name
          FROM scores s2 
          JOIN subjects sub ON sub.id = s2.subject_id
          WHERE s2.student_id = st.id
            AND s2.class_id = ?
            ${semester ? "AND s2.semester = ?" : ""}
            ${schoolYear ? "AND s2.school_year = ?" : ""}
          ORDER BY s2.score ASC
          LIMIT 1
        ) AS weakest_subject_name
      FROM students st
      LEFT JOIN scores sc ON sc.student_id = st.id
        AND sc.class_id = ?
        ${semester ? "AND sc.semester = ?" : ""}
        ${schoolYear ? "AND sc.school_year = ?" : ""}
      WHERE st.class_id = ?
      GROUP BY st.id;
    `;

    // ===== TẠO PARAMS ĐÚNG THỨ TỰ =====
    const params = [];

    // Subquery params (weakest subject)
    params.push(classId);
    if (semester) params.push(semester);
    if (schoolYear) params.push(schoolYear);

    // JOIN params
    params.push(classId);
    if (semester) params.push(semester);
    if (schoolYear) params.push(schoolYear);

    // WHERE st.class_id = ?
    params.push(classId);

    const rows = await sequelize.query(query, {
      replacements: params,
      type: QueryTypes.SELECT,
    });

    return res.json({ data: rows });
  } catch (err) {
    console.error("getStudentStats error:", err);
    return res.status(500).json({
      message: "Lỗi server khi lấy bảng điểm",
    });
  }
};
