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

  if (!teacher_id || !class_id || !subject_id || !semester || !school_year) {
    return res
      .status(400)
      .json({ msg: "Please provide all required fields for assignment" });
  }

  try {
    // Check if teacher, class, and subject exist
    const teacher = await Teacher.findByPk(teacher_id);
    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }

    const classInstance = await Class.findByPk(class_id);
    if (!classInstance) {
      return res.status(404).json({ msg: "Class not found" });
    }

    const subject = await Subject.findByPk(subject_id);
    if (!subject) {
      return res.status(404).json({ msg: "Subject not found" });
    }

    const newAssignment = await Assignment.create({
      teacher_id,
      class_id,
      subject_id,
      semester,
      school_year,
    });

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
  const { teacher_id, class_id, subject_id, semester, school_year } = req.body;

  try {
    let assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    // If core fields are being updated, check for existence
    if (teacher_id) {
      const teacher = await Teacher.findByPk(teacher_id);
      if (!teacher) {
        return res.status(404).json({ msg: "Teacher not found" });
      }
    }

    if (class_id) {
      const classInstance = await Class.findByPk(class_id);
      if (!classInstance) {
        return res.status(404).json({ msg: "Class not found" });
      }
    }

    if (subject_id) {
      const subject = await Subject.findByPk(subject_id);
      if (!subject) {
        return res.status(404).json({ msg: "Subject not found" });
      }
    }

    // Check for unique constraint violation before updating
    const existingAssignment = await Assignment.findOne({
      where: {
        teacher_id: teacher_id || assignment.teacher_id,
        class_id: class_id || assignment.class_id,
        subject_id: subject_id || assignment.subject_id,
        semester: semester || assignment.semester,
        school_year: school_year || assignment.school_year,
        id: { [Op.ne]: id },
      },
    });

    if (existingAssignment) {
      return res
        .status(400)
        .json({ msg: "This teaching assignment already exists." });
    }

    await assignment.update(req.body);

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
    console.error(err.message);
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
        return res
          .status(400)
          .json({
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
