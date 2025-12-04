// src/controllers/subjectReportController.js
const db = require("../models");
const { sequelize } = db;
const { QueryTypes } = require("sequelize");

/**
 * =========================
 *  ADMIN – THỐNG KÊ THEO MÔN
 * =========================
 */

/**
 * GET /api/reports/subjects/:subjectId/summary?semester=&school_year=
 * Tổng quan 1 môn: tổng HS, tổng lớp, điểm TB, tỉ lệ qua môn
 */
exports.getSubjectSummaryAdmin = async (req, res) => {
  try {
    const subjectId = parseInt(req.params.subjectId, 10);
    const semester = req.query.semester || null;
    const schoolYear = req.query.school_year || null;

    if (!subjectId) {
      return res.status(400).json({ message: "subjectId không hợp lệ" });
    }

    const whereParts = ["subject_id = ?"];
    const params = [subjectId];

    if (semester) {
      whereParts.push("semester = ?");
      params.push(semester);
    }
    if (schoolYear) {
      whereParts.push("school_year = ?");
      params.push(schoolYear);
    }

    const whereClause = whereParts.join(" AND ");

    const sql = `
      SELECT
        COUNT(DISTINCT student_id) AS total_students,
        COUNT(DISTINCT class_id)   AS total_classes,
        AVG(score)                 AS avg_score,
        SUM(CASE WHEN score >= 5 THEN 1 ELSE 0 END) / COUNT(*) * 100 AS pass_rate
      FROM scores
      WHERE ${whereClause};
    `;

    const [row] = await sequelize.query(sql, {
      replacements: params,
      type: QueryTypes.SELECT,
    });

    return res.json({
      data: {
        total_students: Number(row.total_students || 0),
        total_classes: Number(row.total_classes || 0),
        avg_score: Number(row.avg_score || 0),
        pass_rate: Number(row.pass_rate || 0),
      },
    });
  } catch (err) {
    console.error("getSubjectSummaryAdmin error:", err);
    return res
      .status(500)
      .json({ message: "Lỗi server khi lấy thống kê môn (admin)" });
  }
};

/**
 * GET /api/reports/subjects/:subjectId/classes?semester=&school_year=
 * Thống kê theo lớp cho 1 môn: TB, tỉ lệ qua môn, sĩ số
 */
exports.getSubjectClassStatsAdmin = async (req, res) => {
  try {
    const subjectId = parseInt(req.params.subjectId, 10);
    const semester = req.query.semester || null;
    const schoolYear = req.query.school_year || null;

    if (!subjectId) {
      return res.status(400).json({ message: "subjectId không hợp lệ" });
    }

    const whereParts = ["s.subject_id = ?"];
    const params = [subjectId];

    if (semester) {
      whereParts.push("s.semester = ?");
      params.push(semester);
    }
    if (schoolYear) {
      whereParts.push("s.school_year = ?");
      params.push(schoolYear);
    }

    const whereClause = whereParts.join(" AND ");

    const sql = `
      SELECT
        c.id          AS class_id,
        c.class_code,
        c.class_name,
        AVG(s.score)  AS avg_score,
        COUNT(DISTINCT s.student_id) AS student_count,
        SUM(CASE WHEN s.score >= 5 THEN 1 ELSE 0 END) / COUNT(*) * 100 AS pass_rate
      FROM scores s
      JOIN classes c ON c.id = s.class_id
      WHERE ${whereClause}
      GROUP BY c.id, c.class_code, c.class_name
      ORDER BY c.class_code;
    `;

    const rows = await sequelize.query(sql, {
      replacements: params,
      type: QueryTypes.SELECT,
    });

    return res.json({ data: rows });
  } catch (err) {
    console.error("getSubjectClassStatsAdmin error:", err);
    return res
      .status(500)
      .json({ message: "Lỗi server khi lấy thống kê lớp theo môn (admin)" });
  }
};

/**
 * GET /api/reports/subjects/:subjectId/students?semester=&school_year=&class_id=
 * Danh sách học sinh + điểm TB + xếp loại cho 1 môn
 */
exports.getSubjectStudentStatsAdmin = async (req, res) => {
  try {
    const subjectId = parseInt(req.params.subjectId, 10);
    const semester = req.query.semester || null;
    const schoolYear = req.query.school_year || null;
    const classId = req.query.class_id
      ? parseInt(req.query.class_id, 10)
      : null;

    if (!subjectId) {
      return res.status(400).json({ message: "subjectId không hợp lệ" });
    }

    const whereParts = ["sc.subject_id = ?"];
    const params = [subjectId];

    if (classId) {
      whereParts.push("sc.class_id = ?");
      params.push(classId);
    }
    if (semester) {
      whereParts.push("sc.semester = ?");
      params.push(semester);
    }
    if (schoolYear) {
      whereParts.push("sc.school_year = ?");
      params.push(schoolYear);
    }

    const whereClause = whereParts.join(" AND ");

    const sql = `
      SELECT
        st.id           AS student_id,
        st.student_code,
        st.full_name,
        AVG(sc.score)   AS avg_score,
        CASE
          WHEN AVG(sc.score) >= 8   THEN 'Giỏi'
          WHEN AVG(sc.score) >= 6.5 THEN 'Khá'
          WHEN AVG(sc.score) >= 5   THEN 'Trung bình'
          ELSE 'Yếu'
        END AS rating
      FROM scores sc
      JOIN students st ON st.id = sc.student_id
      WHERE ${whereClause}
      GROUP BY st.id, st.student_code, st.full_name
      ORDER BY st.full_name;
    `;

    const rows = await sequelize.query(sql, {
      replacements: params,
      type: QueryTypes.SELECT,
    });

    return res.json({ data: rows });
  } catch (err) {
    console.error("getSubjectStudentStatsAdmin error:", err);
    return res
      .status(500)
      .json({ message: "Lỗi server khi lấy bảng điểm môn (admin)" });
  }
};

/**
 * =========================
 *  TEACHER – THỐNG KÊ THEO MÔN
 *  (CHỈ MÔN & LỚP GV ĐƯỢC PHÂN CÔNG)
 * =========================
 */

/**
 * GET /api/reports/teacher/subject/:subjectId/summary?semester=&school_year=
 */
exports.getSubjectSummaryTeacher = async (req, res) => {
  try {
    const teacherId = req.user?.teacher_id;
    const subjectId = parseInt(req.params.subjectId, 10);
    const semester = req.query.semester || null;
    const schoolYear = req.query.school_year || null;

    if (!teacherId) {
      return res.status(401).json({ message: "Không xác định được giáo viên" });
    }
    if (!subjectId) {
      return res.status(400).json({ message: "subjectId không hợp lệ" });
    }

    const whereParts = ["s.subject_id = ?", "a.teacher_id = ?"];
    const params = [subjectId, teacherId];

    if (semester) {
      whereParts.push("s.semester = ?");
      params.push(semester);
    }
    if (schoolYear) {
      // dùng school_year của scores (hoặc có thể AND a.school_year = ? nếu em đồng bộ)
      whereParts.push("s.school_year = ?");
      params.push(schoolYear);
    }

    const whereClause = whereParts.join(" AND ");

    const sql = `
      SELECT
        COUNT(DISTINCT s.student_id) AS total_students,
        COUNT(DISTINCT s.class_id)   AS total_classes,
        AVG(s.score)                 AS avg_score,
        SUM(CASE WHEN s.score >= 5 THEN 1 ELSE 0 END) / COUNT(*) * 100 AS pass_rate
      FROM scores s
      JOIN assignments a
        ON a.class_id = s.class_id
       AND a.subject_id = s.subject_id
      WHERE ${whereClause};
    `;

    const [row] = await sequelize.query(sql, {
      replacements: params,
      type: QueryTypes.SELECT,
    });

    return res.json({
      data: {
        total_students: Number(row.total_students || 0),
        total_classes: Number(row.total_classes || 0),
        avg_score: Number(row.avg_score || 0),
        pass_rate: Number(row.pass_rate || 0),
      },
    });
  } catch (err) {
    console.error("getSubjectSummaryTeacher error:", err);
    return res
      .status(500)
      .json({ message: "Lỗi server khi lấy thống kê môn (giáo viên)" });
  }
};

/**
 * GET /api/reports/teacher/subject/:subjectId/classes?semester=&school_year=
 * Thống kê theo lớp cho GV (chỉ lớp GV dạy)
 */
exports.getSubjectClassStatsTeacher = async (req, res) => {
  try {
    const teacherId = req.user?.teacher_id;
    const subjectId = parseInt(req.params.subjectId, 10);
    const semester = req.query.semester || null;
    const schoolYear = req.query.school_year || null;

    if (!teacherId) {
      return res.status(401).json({ message: "Không xác định được giáo viên" });
    }
    if (!subjectId) {
      return res.status(400).json({ message: "subjectId không hợp lệ" });
    }

    const whereParts = ["s.subject_id = ?", "a.teacher_id = ?"];
    const params = [subjectId, teacherId];

    if (semester) {
      whereParts.push("s.semester = ?");
      params.push(semester);
    }
    if (schoolYear) {
      whereParts.push("s.school_year = ?");
      params.push(schoolYear);
    }

    const whereClause = whereParts.join(" AND ");

    const sql = `
      SELECT
        c.id          AS class_id,
        c.class_code,
        c.class_name,
        AVG(s.score)  AS avg_score,
        COUNT(DISTINCT s.student_id) AS student_count,
        SUM(CASE WHEN s.score >= 5 THEN 1 ELSE 0 END) / COUNT(*) * 100 AS pass_rate
      FROM scores s
      JOIN classes c ON c.id = s.class_id
      JOIN assignments a
        ON a.class_id = s.class_id
       AND a.subject_id = s.subject_id
      WHERE ${whereClause}
      GROUP BY c.id, c.class_code, c.class_name
      ORDER BY c.class_code;
    `;

    const rows = await sequelize.query(sql, {
      replacements: params,
      type: QueryTypes.SELECT,
    });

    return res.json({ data: rows });
  } catch (err) {
    console.error("getSubjectClassStatsTeacher error:", err);
    return res.status(500).json({
      message: "Lỗi server khi lấy thống kê lớp theo môn (giáo viên)",
    });
  }
};

/**
 * GET /api/reports/teacher/subject/:subjectId/students?semester=&school_year=&class_id=
 * Danh sách HS theo môn, chỉ trong lớp GV có dạy
 */
exports.getSubjectStudentStatsTeacher = async (req, res) => {
  try {
    const teacherId = req.user?.teacher_id;
    const subjectId = parseInt(req.params.subjectId, 10);
    const semester = req.query.semester || null;
    const schoolYear = req.query.school_year || null;
    const classId = req.query.class_id
      ? parseInt(req.query.class_id, 10)
      : null;

    if (!teacherId) {
      return res.status(401).json({ message: "Không xác định được giáo viên" });
    }
    if (!subjectId) {
      return res.status(400).json({ message: "subjectId không hợp lệ" });
    }

    const whereParts = ["sc.subject_id = ?", "a.teacher_id = ?"];
    const params = [subjectId, teacherId];

    if (classId) {
      whereParts.push("sc.class_id = ?");
      params.push(classId);
    }
    if (semester) {
      whereParts.push("sc.semester = ?");
      params.push(semester);
    }
    if (schoolYear) {
      whereParts.push("sc.school_year = ?");
      params.push(schoolYear);
    }

    const whereClause = whereParts.join(" AND ");

    const sql = `
      SELECT
        st.id           AS student_id,
        st.student_code,
        st.full_name,
        AVG(sc.score)   AS avg_score,
        CASE
          WHEN AVG(sc.score) >= 8   THEN 'Giỏi'
          WHEN AVG(sc.score) >= 6.5 THEN 'Khá'
          WHEN AVG(sc.score) >= 5   THEN 'Trung bình'
          ELSE 'Yếu'
        END AS rating
      FROM scores sc
      JOIN students st ON st.id = sc.student_id
      JOIN assignments a
        ON a.class_id = sc.class_id
       AND a.subject_id = sc.subject_id
      WHERE ${whereClause}
      GROUP BY st.id, st.student_code, st.full_name
      ORDER BY st.full_name;
    `;

    const rows = await sequelize.query(sql, {
      replacements: params,
      type: QueryTypes.SELECT,
    });

    return res.json({ data: rows });
  } catch (err) {
    console.error("getSubjectStudentStatsTeacher error:", err);
    return res
      .status(500)
      .json({ message: "Lỗi server khi lấy bảng điểm môn (giáo viên)" });
  }
};
