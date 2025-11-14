const { Class, Teacher, User } = require("../models");

// @desc    Get all classes
// @route   GET /api/classes
// @access  Admin

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Teacher,
          attributes: ["id", "teacher_code"],
          include: [
            {
              model: User,
              attributes: ["full_name"],
            },
          ],
        },
      ],
      order: [
        ["school_year", "DESC"],
        ["grade", "ASC"],
        ["class_name", "ASC"],
      ],
    });
    res.json(classes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get class by ID
// @route   GET /api/classes/:id
// @access  Admin
exports.getClassById = async (req, res) => {
  try {
    const singleClass = await Class.findByPk(req.params.id, {
      include: [
        {
          model: Teacher,
          attributes: ["id", "teacher_code"],
          include: [
            {
              model: User,
              attributes: ["full_name"],
            },
          ],
        },
      ],
    });

    if (!singleClass) {
      return res.status(404).json({ msg: "Class not found" });
    }

    res.json(singleClass);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a new class
// @route   POST /api/classes
// @access  Admin
exports.createClass = async (req, res) => {
  const {
    class_code,
    class_name,
    grade,
    school_year,
    homeroom_teacher_id,
    room_number,
    max_students,
    status,
  } = req.body;

  // Validation
  if (!class_code || !class_name || !grade || !school_year) {
    return res.status(400).json({
      msg: "Please provide class_code, class_name, grade, and school_year",
    });
  }

  try {
    const newClass = await Class.create({
      class_code,
      class_name,
      grade,
      school_year,
      homeroom_teacher_id,
      room_number,
      max_students,
      status,
    });
    res.status(201).json(newClass);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Admin
exports.updateClass = async (req, res) => {
  const { id } = req.params;
  const {
    class_code,
    class_name,
    grade,
    school_year,
    homeroom_teacher_id,
    room_number,
    max_students,
    status,
  } = req.body;

  try {
    let singleClass = await Class.findByPk(id);
    if (!singleClass) {
      return res.status(404).json({ msg: "Class not found" });
    }

    singleClass = await singleClass.update(req.body);

    res.json(singleClass);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Admin
exports.deleteClass = async (req, res) => {
  try {
    const singleClass = await Class.findByPk(req.params.id);

    if (!singleClass) {
      return res.status(404).json({ msg: "Class not found" });
    }

    await singleClass.destroy();

    res.json({ msg: "Class removed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
