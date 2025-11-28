// src/controllers/attendanceController.js
const db = require("../models");
const { sequelize } = db;
const { QueryTypes } = require("sequelize");

/**
 * GIÁO VIÊN: Lấy danh sách học sinh trong lớp + trạng thái điểm danh theo ngày/buổi
 * GET /api/attendance/class/:classId?date=YYYY-MM-DD&session=morning|afternoon|all_day
 */
exports.getClassAttendanceTeacher = async (req, res) => {
  try {
    const classId = parseInt(req.params.classId, 10);
    const date = req.query.date;
    const session = req.query.session || "morning";

    if (!classId || !date) {
      return res.status(400).json({ message: "classId và date là bắt buộc" });
    }

    const students = await sequelize.query(
      `
      SELECT 
        s.id AS student_id,
        s.student_code,
        s.full_name,
        a.id AS attendance_id,
        a.status,
        a.session,
        a.attendance_date,
        a.notes
      FROM students s
      LEFT JOIN attendances a
        ON a.student_id = s.id
        AND a.class_id = ?
        AND a.attendance_date = ?
        AND a.session = ?
      WHERE s.class_id = ?
      ORDER BY s.full_name
      `,
      {
        replacements: [classId, date, session, classId],
        type: QueryTypes.SELECT,
      }
    );

    return res.json({
      class_id: classId,
      date,
      session,
      students,
    });
  } catch (err) {
    console.error("getClassAttendanceTeacher error:", err);
    return res
      .status(500)
      .json({ message: "Lỗi server khi lấy danh sách điểm danh" });
  }
};

/**
 * GIÁO VIÊN: Lưu điểm danh (hàng loạt)
 * POST /api/attendance/mark
 */
exports.markAttendanceTeacher = async (req, res) => {
  try {
    const {
      class_id,
      attendance_date,
      session = "morning",
      students,
    } = req.body;

    if (!class_id || !attendance_date || !Array.isArray(students)) {
      return res.status(400).json({
        message: "class_id, attendance_date, students là bắt buộc",
      });
    }

    const recordedBy = req.user?.id;
    if (!recordedBy) {
      return res
        .status(401)
        .json({ message: "Không xác định được người điểm danh" });
    }

    if (students.length === 0) {
      return res.json({ message: "Không có học sinh nào để lưu" });
    }

    const values = students.map((st) => [
      st.student_id,
      class_id,
      attendance_date,
      session,
      st.status || "present",
      st.notes || null,
      recordedBy,
    ]);

    await sequelize.query(
      `
      INSERT INTO attendances (
        student_id,
        class_id,
        attendance_date,
        session,
        status,
        notes,
        recorded_by
      )
      VALUES ${values.map(() => "(?,?,?,?,?,?,?)").join(",")}
      ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        notes = VALUES(notes),
        recorded_by = VALUES(recorded_by)
      `,
      {
        replacements: values.flat(),
        type: QueryTypes.INSERT,
      }
    );

    return res.json({ message: "Lưu điểm danh thành công" });
  } catch (err) {
    console.error("markAttendanceTeacher error:", err);
    return res.status(500).json({ message: "Lỗi server khi lưu điểm danh" });
  }
};

/**
 * ADMIN: Lấy điểm danh toàn trường trong 1 ngày
 * GET /api/attendance/admin/date?date=YYYY-MM-DD&session=...
 */
exports.getAttendanceByDateAdmin = async (req, res) => {
  try {
    const date = req.query.date;
    const session = req.query.session; // optional

    if (!date) {
      return res.status(400).json({ message: "date là bắt buộc" });
    }

    const params = [date];
    let sessionCondition = "";
    if (session) {
      sessionCondition = "AND a.session = ?";
      params.push(session);
    }

    const records = await sequelize.query(
      `
      SELECT
        a.id,
        a.attendance_date,
        a.session,
        a.status,
        a.notes,
        s.id AS student_id,
        s.student_code,
        s.full_name,
        c.id AS class_id,
        c.class_code,
        c.class_name
      FROM attendances a
      JOIN students s ON s.id = a.student_id
      JOIN classes c ON c.id = a.class_id
      WHERE a.attendance_date = ?
      ${sessionCondition}
      ORDER BY c.class_code, s.full_name
      `,
      {
        replacements: params,
        type: QueryTypes.SELECT,
      }
    );

    return res.json({
      date,
      session: session || null,
      records,
    });
  } catch (err) {
    console.error("getAttendanceByDateAdmin error:", err);
    return res
      .status(500)
      .json({ message: "Lỗi server khi lấy điểm danh toàn trường" });
  }
};

/**
 * ADMIN: Lấy điểm danh theo lớp
 * GET /api/attendance/admin/class/:classId?date=YYYY-MM-DD&session=...
 */
exports.getClassAttendanceAdmin = exports.getClassAttendanceTeacher;

/**
 * ADMIN: Lịch sử điểm danh 1 học sinh
 * GET /api/attendance/admin/student/:studentId?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
exports.getStudentAttendanceHistoryAdmin = async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId, 10);
    const from = req.query.from || null;
    const to = req.query.to || null;

    if (!studentId) {
      return res.status(400).json({ message: "studentId không hợp lệ" });
    }

    const params = [studentId];
    let dateCondition = "";

    if (from) {
      dateCondition += " AND a.attendance_date >= ?";
      params.push(from);
    }
    if (to) {
      dateCondition += " AND a.attendance_date <= ?";
      params.push(to);
    }

    const records = await sequelize.query(
      `
      SELECT
        a.id,
        a.attendance_date,
        a.session,
        a.status,
        a.notes,
        c.id AS class_id,
        c.class_code,
        c.class_name
      FROM attendances a
      JOIN classes c ON c.id = a.class_id
      WHERE a.student_id = ?
      ${dateCondition}
      ORDER BY a.attendance_date DESC, a.session
      `,
      {
        replacements: params,
        type: QueryTypes.SELECT,
      }
    );

    return res.json({
      student_id: studentId,
      from,
      to,
      records,
    });
  } catch (err) {
    console.error("getStudentAttendanceHistoryAdmin error:", err);
    return res
      .status(500)
      .json({ message: "Lỗi server khi lấy lịch sử điểm danh học sinh" });
  }
};

/**
 * ADMIN: Cập nhật 1 bản ghi điểm danh
 * PATCH /api/attendance/admin/:id
 */
exports.updateAttendanceAdmin = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, notes } = req.body;

    if (!id) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }
    if (!status) {
      return res.status(400).json({ message: "status là bắt buộc" });
    }

    await sequelize.query(
      `
      UPDATE attendances
      SET status = ?, notes = ?
      WHERE id = ?
      `,
      {
        replacements: [status, notes || null, id],
        type: QueryTypes.UPDATE,
      }
    );

    return res.json({ message: "Cập nhật điểm danh thành công" });
  } catch (err) {
    console.error("updateAttendanceAdmin error:", err);
    return res
      .status(500)
      .json({ message: "Lỗi server khi cập nhật điểm danh" });
  }
};

/**
 * ADMIN: Xóa 1 bản ghi điểm danh
 * DELETE /api/attendance/admin/:id
 */
exports.deleteAttendanceAdmin = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (!id) {
      return res.status(400).json({ message: "id không hợp lệ" });
    }

    await sequelize.query(
      `
      DELETE FROM attendances
      WHERE id = ?
      `,
      {
        replacements: [id],
        type: QueryTypes.DELETE,
      }
    );

    return res.json({ message: "Xóa bản ghi điểm danh thành công" });
  } catch (err) {
    console.error("deleteAttendanceAdmin error:", err);
    return res.status(500).json({ message: "Lỗi server khi xóa điểm danh" });
  }
};

// ADMIN: Cập nhật nhiều bản ghi điểm danh cùng lúc
// ADMIN: Upsert (tạo mới hoặc cập nhật) nhiều bản ghi điểm danh cùng lúc
// Upsert hàng loạt: nếu đã có (student_id, attendance_date, session) thì UPDATE, chưa có thì INSERT
exports.bulkUpsertAttendanceAdmin = async (req, res) => {
  try {
    const { items } = req.body;
    const recordedBy = req.user?.id; // admin đang login

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Danh sách items không hợp lệ" });
    }

    // Chuẩn bị values cho bulk insert
    const values = items.map((i) => [
      i.student_id,
      i.class_id,
      i.attendance_date,
      i.session || "morning",
      i.status || "present",
      i.notes || null,
      recordedBy,
    ]);

    // LƯU Ý: bảng attendances đã có UNIQUE KEY (student_id, attendance_date, session)
    await sequelize.query(
      `
      INSERT INTO attendances (
        student_id,
        class_id,
        attendance_date,
        session,
        status,
        notes,
        recorded_by
      )
      VALUES ${values.map(() => "(?,?,?,?,?,?,?)").join(",")}
      ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        notes  = VALUES(notes),
        recorded_by = VALUES(recorded_by)
      `,
      {
        replacements: values.flat(),
      }
    );

    return res.json({
      message: "Cập nhật điểm danh hàng loạt thành công",
      count: items.length,
    });
  } catch (err) {
    console.error("bulkUpsertAttendanceAdmin error:", err);
    return res
      .status(500)
      .json({ message: "Lỗi server khi cập nhật điểm danh hàng loạt" });
  }
};
