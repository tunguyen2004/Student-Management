const { User, Teacher, sequelize } = require("../models");
const bcrypt = require("bcryptjs");

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Admin
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.findAll({
      where: { role: "teacher" },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Teacher,
          required: true, // INNER JOIN to only get users that are also teachers
        },
      ],
      order: [["full_name", "ASC"]],
    });

    res.json(teachers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get teacher by ID
// @route   GET /api/teachers/:id
// @access  Admin
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findOne({
      where: { id: req.params.id, role: "teacher" },
      attributes: { exclude: ["password"] },
      include: [{ model: Teacher, required: true }],
    });

    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }
    res.json(teacher);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a new teacher
// @route   POST /api/teachers
// @access  Admin
exports.createTeacher = async (req, res) => {
  const {
    // User fields
    username,
    password,
    full_name,
    email,
    phone,
    address,
    date_of_birth,
    gender,
    // Teacher fields
    teacher_code,
    specialization,
    degree,
    start_date,
    salary,
    bank_account,
    bank_name,
    notes,
  } = req.body;

  // Basic validation
  if (!username || !password || !full_name || !teacher_code) {
    return res
      .status(400)
      .json({
        msg: "Please provide username, password, full_name, and teacher_code",
      });
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      // Check if username or email already exists
      const userExists = await User.findOne({
        where: { username },
        transaction: t,
      });
      if (userExists) {
        throw new Error("Username already exists");
      }
      if (email) {
        const emailExists = await User.findOne({
          where: { email },
          transaction: t,
        });
        if (emailExists) {
          throw new Error("Email already exists");
        }
      }
      const teacherCodeExists = await Teacher.findOne({
        where: { teacher_code },
        transaction: t,
      });
      if (teacherCodeExists) {
        throw new Error("Teacher code already exists");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const newUser = await User.create(
        {
          username,
          password: hashedPassword,
          full_name,
          email,
          phone,
          address,
          date_of_birth,
          gender,
          role: "teacher",
        },
        { transaction: t }
      );

      // Create teacher
      await Teacher.create(
        {
          user_id: newUser.id,
          teacher_code,
          specialization,
          degree,
          start_date,
          salary,
          bank_account,
          bank_name,
          notes,
        },
        { transaction: t }
      );

      // Re-fetch the created profile to return
      const createdProfile = await User.findByPk(newUser.id, {
        attributes: { exclude: ["password"] },
        include: [{ model: Teacher, required: true }],
        transaction: t,
      });

      return createdProfile;
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err.message);
    // Return specific error messages from the transaction

    res.status(500).send("Server Error");
  }
};

// @desc    Update a teacher
// @route   PUT /api/teachers/:id
// @access  Admin
exports.updateTeacher = async (req, res) => {
  const { id } = req.params;
  // Destructure allowed fields
  const {
    full_name,
    email,
    phone,
    address,
    date_of_birth,
    gender,
    is_active,
  } = req.body;
  const userFields = {
    full_name,
    email,
    phone,
    address,
    date_of_birth,
    gender,
    is_active,
  };

  const {
    specialization,
    degree,
    start_date,
    salary,
    bank_account,
    bank_name,
    notes,
  } = req.body;
  const teacherFields = {
    specialization,
    degree,
    start_date,
    salary,
    bank_account,
    bank_name,
    notes,
  };

  // Filter out undefined fields
  Object.keys(userFields).forEach(
    (key) => userFields[key] === undefined && delete userFields[key]
  );
  Object.keys(teacherFields).forEach(
    (key) => teacherFields[key] === undefined && delete teacherFields[key]
  );

  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await User.findOne({
        where: { id, role: "teacher" },
        transaction: t,
      });
      if (!user) {
        throw new Error("Teacher not found");
      }

      // Update user fields
      if (Object.keys(userFields).length > 0) {
        await user.update(userFields, { transaction: t });
      }

      // Update teacher fields
      if (Object.keys(teacherFields).length > 0) {
        const teacher = await Teacher.findOne({
          where: { user_id: id },
          transaction: t,
        });
        if (teacher) {
          await teacher.update(teacherFields, { transaction: t });
        }
      }

      // Re-fetch the full profile to return
      const updatedProfile = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
        include: [{ model: Teacher, required: true }],
        transaction: t,
      });

      return updatedProfile;
    });

    res.json(result);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
};

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Admin
exports.deleteTeacher = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id, role: "teacher" },
    });

    if (!user) {
      return res.status(404).json({ msg: "Teacher not found" });
    }

    // The ON DELETE CASCADE in the database should handle deleting the teacher record
    await user.destroy();

    res.json({ msg: "Teacher removed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

