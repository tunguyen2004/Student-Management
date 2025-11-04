const { Attendance, Student, Class, Subject, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get attendance by class, subject, and date
// @route   GET /api/attendance/class/:class_id
// @access  Admin
exports.getAttendanceByClass = async (req, res) => {
  const { class_id } = req.params;
  const { date, subject_id } = req.query;

  if (!date || !subject_id) {
    return res.status(400).json({ msg: 'Please provide date and subject_id query parameters.' });
  }

  try {
    const attendance = await Attendance.findAll({
      where: {
        class_id,
        subject_id,
        attendance_date: date,
      },
      include: [
        { model: Student, attributes: ['student_code', 'full_name'] },
        { model: Subject, attributes: ['subject_code', 'subject_name'] },
      ],
    });

    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get attendance by student
// @route   GET /api/attendance/student/:student_id
// @access  Admin
exports.getAttendanceByStudent = async (req, res) => {
  const { student_id } = req.params;
  const { subject_id, from_date, to_date } = req.query;

  const whereClause = {
    student_id,
  };

  if (subject_id) {
    whereClause.subject_id = subject_id;
  }

  if (from_date && to_date) {
    whereClause.attendance_date = {
      [Op.between]: [from_date, to_date],
    };
  }

  try {
    const attendance = await Attendance.findAll({
      where: whereClause,
      include: [
        { model: Class, attributes: ['class_code', 'class_name'] },
        { model: Subject, attributes: ['subject_code', 'subject_name'] },
      ],
      order: [['attendance_date', 'DESC']],
    });

    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Take or update attendance for a class
// @route   POST /api/attendance
// @access  Admin
exports.takeAttendance = async (req, res) => {
  const { attendance_data } = req.body; // array of attendance objects
  const recorded_by = req.user.id;

  if (!Array.isArray(attendance_data) || attendance_data.length === 0) {
    return res.status(400).json({ msg: 'Please provide a non-empty array of attendance data.' });
  }

  const t = await sequelize.transaction();

  try {
    const results = [];
    for (const data of attendance_data) {
      const { student_id, class_id, subject_id, attendance_date, session, status, notes } = data;

      if (!student_id || !class_id || !subject_id || !attendance_date || !status) {
        await t.rollback();
        return res.status(400).json({ msg: 'Missing required fields for one or more attendance records.' });
      }

      const [attendance, created] = await Attendance.findOrCreate({
        where: { student_id, class_id, subject_id, attendance_date, session: session || 'all_day' },
        defaults: { status, notes, recorded_by },
        transaction: t,
      });

      if (!created) {
        await attendance.update({ status, notes, recorded_by }, { transaction: t });
        results.push({ ...attendance.toJSON(), updated: true });
      } else {
        results.push({ ...attendance.toJSON(), created: true });
      }
    }

    await t.commit();
    res.status(201).json(results);
  } catch (err) {
    await t.rollback();
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a single attendance record
// @route   PUT /api/attendance/:id
// @access  Admin
exports.updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const recorded_by = req.user.id;

  try {
    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      return res.status(404).json({ msg: 'Attendance record not found.' });
    }

    await attendance.update({ status, notes, recorded_by });

    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
