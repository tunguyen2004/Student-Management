const {
  Assignment,
  Teacher,
  User,
  Class,
  Subject,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Admin
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [
        {
          model: Teacher,
          attributes: ["teacher_code"],
          include: [{ model: User, attributes: ["full_name"] }],
        },
        {
          model: Class,
          attributes: ["class_code", "class_name"],
        },
        {
          model: Subject,
          attributes: ["subject_code", "subject_name"],
        },
      ],
      order: [
        ["school_year", "DESC"],
        ["semester", "ASC"],
      ],
    });
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
// @access  Admin
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [
        {
          model: Teacher,
          include: [{ model: User, attributes: ["full_name"] }],
        },
        { model: Class },
        { model: Subject },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Admin
exports.createAssignment = async (req, res) => {
  const { teacher_id, class_id, subject_id, semester, school_year } = req.body;

  // ✅ Convert teaching_schedule nếu FE gửi JSON string
  if (req.body.teaching_schedule) {
    try {
      if (typeof req.body.teaching_schedule === "string") {
        req.body.teaching_schedule = JSON.parse(req.body.teaching_schedule);
      }
      req.body.teaching_schedule = JSON.stringify(req.body.teaching_schedule);
    } catch (e) {
      return res.status(400).json({ msg: "Invalid teaching_schedule format" });
    }
  }

  if (!teacher_id || !class_id || !subject_id || !semester || !school_year) {
    return res
      .status(400)
      .json({ msg: "Please provide all required fields for assignment" });
  }

  try {
    // Check if teacher, class and subject exist
    const teacher = await Teacher.findByPk(teacher_id);
    const classInstance = await Class.findByPk(class_id);
    const subject = await Subject.findByPk(subject_id);

    if (!teacher) return res.status(404).json({ msg: "Teacher not found" });
    if (!classInstance) return res.status(404).json({ msg: "Class not found" });
    if (!subject) return res.status(404).json({ msg: "Subject not found" });

    // ✅ Create assignment with req.body (đã xử lý schedule)
    const newAssignment = await Assignment.create(req.body);

    const assignmentWithDetails = await Assignment.findByPk(newAssignment.id, {
      include: [
        {
          model: Teacher,
          include: [{ model: User, attributes: ["full_name"] }],
        },
        { model: Class },
        { model: Subject },
      ],
    });

    res.status(201).json(assignmentWithDetails);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ msg: "This teaching assignment already exists." });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update an assignment
// @route   PUT /api/assignments/:id
// @access  Admin
exports.updateAssignment = async (req, res) => {
  const { id } = req.params;

  // ✅ Convert teaching_schedule nếu FE gửi JSON string
  if (req.body.teaching_schedule) {
    try {
      if (typeof req.body.teaching_schedule === "string") {
        req.body.teaching_schedule = JSON.parse(req.body.teaching_schedule);
      }
      req.body.teaching_schedule = JSON.stringify(req.body.teaching_schedule);
    } catch (e) {
      return res.status(400).json({ msg: "Invalid teaching_schedule format" });
    }
  }

  try {
    // ✅ Trước tiên phải tìm assignment
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    const { teacher_id, class_id, subject_id, semester, school_year } =
      req.body;

    if (!teacher_id || !class_id || !subject_id || !semester || !school_year) {
      return res.status(400).json({
        msg: "Please provide all required fields for assignment",
      });
    }

    // ✅ Kiểm tra tồn tại của teacher/class/subject
    const teacher = await Teacher.findByPk(teacher_id);
    const classInstance = await Class.findByPk(class_id);
    const subject = await Subject.findByPk(subject_id);

    if (!teacher) return res.status(404).json({ msg: "Teacher not found" });
    if (!classInstance) return res.status(404).json({ msg: "Class not found" });
    if (!subject) return res.status(404).json({ msg: "Subject not found" });

    // ✅ Update
    await assignment.update(req.body);

    // ✅ Lấy lại bản ghi sau update
    const updatedAssignment = await Assignment.findByPk(id, {
      include: [
        {
          model: Teacher,
          include: [{ model: User, attributes: ["full_name"] }],
        },
        { model: Class },
        { model: Subject },
      ],
    });

    res.json(updatedAssignment);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ msg: "This teaching assignment already exists." });
    }

    console.error(err);
    res.status(500).send("Server Error");
  }
};

// @desc    Delete an assignment
// @route   DELETE /api/assignments/:id
// @access  Admin
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    await assignment.destroy();

    res.json({ msg: "Assignment removed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Bulk assign teachers to classes and subjects
// @route   POST /api/assignments/bulk
// @access  Admin
exports.bulkAssignTeachers = async (req, res) => {
  const { assignments } = req.body; // assignments is an array of assignment objects

  if (!Array.isArray(assignments) || assignments.length === 0) {
    return res
      .status(400)
      .json({ msg: "Please provide a non-empty array of assignments." });
  }

  const t = await sequelize.transaction();

  try {
    const createdAssignments = [];

    for (const assignmentData of assignments) {
      const { teacher_id, class_id, subject_id, semester, school_year } =
        assignmentData;

      if (
        !teacher_id ||
        !class_id ||
        !subject_id ||
        !semester ||
        !school_year
      ) {
        await t.rollback();
        return res
          .status(400)
          .json({ msg: "All fields are required for each assignment." });
      }

      // Check for existence of teacher, class, and subject
      const teacher = await Teacher.findByPk(teacher_id, { transaction: t });
      if (!teacher) {
        await t.rollback();
        return res
          .status(404)
          .json({ msg: `Teacher with ID ${teacher_id} not found.` });
      }

      const classInstance = await Class.findByPk(class_id, { transaction: t });
      if (!classInstance) {
        await t.rollback();
        return res
          .status(404)
          .json({ msg: `Class with ID ${class_id} not found.` });
      }

      const subject = await Subject.findByPk(subject_id, { transaction: t });
      if (!subject) {
        await t.rollback();
        return res
          .status(404)
          .json({ msg: `Subject with ID ${subject_id} not found.` });
      }

      // Check for unique constraint violation
      const existingAssignment = await Assignment.findOne({
        where: { teacher_id, class_id, subject_id, semester, school_year },
        transaction: t,
      });

      if (existingAssignment) {
        await t.rollback();
        return res.status(400).json({
          msg: `Assignment for teacher ${teacher_id}, class ${class_id}, and subject ${subject_id} already exists.`,
        });
      }

      const newAssignment = await Assignment.create(assignmentData, {
        transaction: t,
      });
      createdAssignments.push(newAssignment);
    }

    await t.commit();

    // Fetch the created assignments with their associations
    const detailedAssignments = await Assignment.findAll({
      where: {
        id: { [Op.in]: createdAssignments.map((a) => a.id) },
      },
      include: [
        {
          model: Teacher,
          include: [{ model: User, attributes: ["full_name"] }],
        },
        { model: Class },
        { model: Subject },
      ],
    });

    res.status(201).json(detailedAssignments);
  } catch (err) {
    await t.rollback();
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get free/occupied teaching slots for a class (avoid time conflicts)
// @route   GET /api/assignments/free-slots
// @access  Admin + Teacher
exports.getFreeSlots = async (req, res) => {
  const { class_id, semester, school_year } = req.query;

  if (!class_id || !semester || !school_year) {
    return res.status(400).json({
      msg: "Missing required params: class_id, semester, school_year",
    });
  }

  try {
    const assignments = await Assignment.findAll({
      where: { class_id, semester, school_year },
      attributes: ["teaching_schedule"],
    });

    const occupied = {};

    assignments.forEach((a) => {
      if (!a.teaching_schedule) return;

      const schedule =
        typeof a.teaching_schedule === "string"
          ? JSON.parse(a.teaching_schedule)
          : a.teaching_schedule;

      Object.entries(schedule).forEach(([day, periods]) => {
        if (!occupied[day]) occupied[day] = [];
        occupied[day].push(...periods);
      });
    });

    // tính lịch free ( nếu lớp học có 12 tiết mỗi ngày )
    const allPeriods = [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ];
    const free = {};

    for (let day of ["thu2", "thu3", "thu4", "thu5", "thu6", "thu7"]) {
      free[day] = occupied[day]
        ? allPeriods.filter((p) => !occupied[day].includes(p))
        : [...allPeriods];
    }

    res.json({ occupied, free });
  } catch (error) {
    console.error("❌ ERROR getFreeSlots:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};
// @desc    Validate schedule (check teacher conflicts + class conflicts)
// @route   POST /api/assignments/validate
// @access  Admin + Teacher
exports.validateAssignment = async (req, res) => {
  const { teacher_id, class_id, semester, school_year, teaching_schedule } =
    req.body;

  if (
    !teacher_id ||
    !class_id ||
    !semester ||
    !school_year ||
    !teaching_schedule
  ) {
    return res.status(400).json({ msg: "Missing required fields." });
  }

  const schedule =
    typeof teaching_schedule === "string"
      ? JSON.parse(teaching_schedule)
      : teaching_schedule;

  try {
    const assignments = await Assignment.findAll({
      where: {
        semester,
        school_year,
        [Op.or]: [{ class_id }, { teacher_id }],
      },
      include: [{ model: Subject }],
    });

    for (const a of assignments) {
      if (!a.teaching_schedule) continue;
      const aSchedule =
        typeof a.teaching_schedule === "string"
          ? JSON.parse(a.teaching_schedule)
          : a.teaching_schedule;

      for (const day in schedule) {
        if (!aSchedule[day]) continue;

        const conflict = schedule[day].filter((p) =>
          aSchedule[day].includes(p)
        );

        if (conflict.length > 0) {
          const reason =
            a.class_id === class_id
              ? `❌ Lớp đã có môn khác vào ${day} tiết ${conflict.join(", ")}`
              : `❌ Giáo viên đã dạy lớp khác vào ${day} tiết ${conflict.join(
                  ", "
                )}`;

          return res.json({ valid: false, reason });
        }
      }
    }

    res.json({ valid: true });
  } catch (error) {
    console.error("❌ ERROR validateAssignment:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// @desc  Get assignments for logged-in teacher
// @route GET /api/assignments/teacher
// @access Teacher
exports.getAssignmentsForTeacher = async (req, res) => {
  try {
    const teacherId = req.user.teacher_id; // lấy từ token middleware

    const assignments = await Assignment.findAll({
      where: { teacher_id: teacherId },
      include: [
        {
          model: Class,
          attributes: ["class_code", "class_name", "school_year"],
        },
        {
          model: Subject,
          attributes: ["subject_code", "subject_name"],
        },
      ],
      order: [
        ["school_year", "DESC"],
        ["semester", "ASC"],
      ],
    });

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};
