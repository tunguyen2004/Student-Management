const db = require("../models");
const { sequelize } = db;
const { QueryTypes } = require("sequelize");

exports.getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user?.teacher_id;
    const schoolYear = req.query.school_year || "2024-2025";

    if (!teacherId) {
      return res.status(401).json({ message: "Không xác định được giáo viên" });
    }

    // 1. Lấy thông tin giáo viên
    const teacher = await db.Teacher.findOne({
      where: { id: teacherId },
      include: [db.User],
    });

    // 2. Danh sách lớp GV đang dạy
    const classes = await sequelize.query(
      `
      SELECT c.id, c.class_code, c.class_name
      FROM assignments a
      JOIN classes c ON c.id = a.class_id
      WHERE a.teacher_id = ?
        AND a.school_year = ?
      GROUP BY c.id
      `,
      {
        replacements: [teacherId, schoolYear],
        type: QueryTypes.SELECT,
      }
    );

    // 3. Tổng số học sinh từ tất cả lớp
    const [studentCount] = await sequelize.query(
      `
      SELECT COUNT(*) AS total_students
      FROM students
      WHERE class_id IN (
        SELECT class_id FROM assignments WHERE teacher_id = ?
      )
      `,
      {
        replacements: [teacherId],
        type: QueryTypes.SELECT,
      }
    );

    // 4. Danh sách môn GV dạy
    const subjects = await sequelize.query(
      `
      SELECT s.id, s.subject_name
      FROM assignments a
      JOIN subjects s ON s.id = a.subject_id
      WHERE a.teacher_id = ?
        AND a.school_year = ?
      GROUP BY s.id
      `,
      {
        replacements: [teacherId, schoolYear],
        type: QueryTypes.SELECT,
      }
    );

    // 5. Lấy thống kê nhanh cho môn đầu tiên (nếu có)
    let quickStats = {
      avg_score: 0,
      pass_rate: 0,
      total_students: 0,
    };

    if (subjects.length > 0) {
      const subjectId = subjects[0].id;

      const [stat] = await sequelize.query(
        `
        SELECT
          AVG(s.score) AS avg_score,
          SUM(CASE WHEN s.score >= 5 THEN 1 ELSE 0 END) / COUNT(*) * 100 AS pass_rate,
          COUNT(DISTINCT s.student_id) AS total_students
        FROM scores s
        JOIN assignments a
          ON a.class_id = s.class_id AND a.subject_id = s.subject_id
        WHERE s.subject_id = ?
          AND a.teacher_id = ?
          AND s.school_year = ?
        `,
        {
          replacements: [subjectId, teacherId, schoolYear],
          type: QueryTypes.SELECT,
        }
      );

      quickStats = {
        avg_score: Number(stat.avg_score || 0),
        pass_rate: Number(stat.pass_rate || 0),
        total_students: Number(stat.total_students || 0),
      };
    }

    // RESPONSE
    return res.json({
      teacher: {
        id: teacher.id,
        full_name: teacher.User.full_name,
        email: teacher.User.email,
        teacher_code: teacher.teacher_code,
        specialization: teacher.specialization,
      },
      total_classes: classes.length,
      total_students: studentCount.total_students,
      subjects,
      classes,
      quickStats,
    });
  } catch (err) {
    console.error("Teacher dashboard API error:", err);
    res.status(500).json({ message: "Lỗi server, không thể tải dashboard" });
  }
};
