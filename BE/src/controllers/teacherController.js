// src/controllers/teacherController.js
const {
  User,
  Teacher,
  Assignment,
  Student,
  Class,
  sequelize,
} = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize"); // ✅ thêm dòng này

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
    username,
    password,
    full_name,
    email,
    phone,
    address,
    date_of_birth,
    gender,
    specialization,
    degree,
    start_date,
    salary,
    bank_account,
    bank_name,
    notes,
  } = req.body;

  if (!username || !password || !full_name) {
    return res.status(400).json({
      msg: "Please provide username, password, full_name",
    });
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      const userExists = await User.findOne({
        where: { username },
        transaction: t,
      });
      if (userExists) throw new Error("Username already exists");
      const emailExists = await User.findOne({
        where: { email },
        transaction: t,
      });
      if (emailExists) throw new Error("EMAIL_EXISTS");

      // ✅ Tự sinh teacher_code theo năm
      const year = start_date
        ? new Date(start_date).getFullYear()
        : new Date().getFullYear();
      const yearShort = year.toString().slice(-2);

      const lastTeacher = await Teacher.findOne({
        where: {
          teacher_code: {
            [Op.like]: `GV${yearShort}-%`,
          },
        },
        order: [["id", "DESC"]],
        transaction: t,
      });

      let nextCode = `GV${yearShort}-0001`;

      if (lastTeacher?.teacher_code) {
        const lastNumber = parseInt(lastTeacher.teacher_code.split("-")[1]);
        nextCode = `GV${yearShort}-${(lastNumber + 1)
          .toString()
          .padStart(4, "0")}`;
      }

      // ✅ Hash mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // 1️⃣ Tạo user
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

      // 2️⃣ Tạo teacher
      const newTeacher = await Teacher.create(
        {
          user_id: newUser.id,
          teacher_code: nextCode, // ✅ auto code here
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

      return {
        message: "Teacher created successfully",
        user: newUser,
        teacher: newTeacher,
      };
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error(err.message);

    if (err.message === "USERNAME_EXISTS") {
      return res.status(400).json({ msg: "Tên đăng nhập đã tồn tại!" });
    }

    if (err.message === "EMAIL_EXISTS") {
      return res.status(400).json({ msg: "Email đã được sử dụng!" });
    }

    return res.status(500).json({ msg: "Server Error" });
  }
};

// @desc    Update a teacher
// @route   PATCH /api/teachers/:id
// @access  Admin
exports.updateTeacher = async (req, res) => {
  const { id } = req.params;

  // User fields cho update
  const { full_name, email, phone, address, date_of_birth, gender, is_active } =
    req.body;

  const userFields = {
    full_name,
    email,
    phone,
    address,
    date_of_birth,
    gender,
    is_active,
  };

  // Teacher fields — KHÔNG BAO GỒM teacher_code
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

  // Xóa field undefined
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

      if (!user) throw new Error("Teacher not found");
      // Kiểm tra email trùng (ngoại trừ chính user này)
      if (email) {
        const emailUsed = await User.findOne({
          where: { email, id: { [Op.ne]: id } },
          transaction: t,
        });

        if (emailUsed) throw new Error("EMAIL_EXISTS");
      }

      // ✅ Update bảng users
      if (Object.keys(userFields).length > 0) {
        await user.update(userFields, { transaction: t });
      }

      // ✅ Update bảng teachers — KHÔNG update teacher_code
      const teacher = await Teacher.findOne({
        where: { user_id: id },
        transaction: t,
      });

      if (teacher && Object.keys(teacherFields).length > 0) {
        await teacher.update(teacherFields, { transaction: t });
      }

      // ✅ Fetch lại đầy đủ để trả về FE
      const updatedProfile = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
        include: [{ model: Teacher }],
        transaction: t,
      });

      return updatedProfile;
    });

    res.json(result);
  } catch (err) {
    console.error(err.message);

    if (err.message === "EMAIL_EXISTS") {
      return res.status(400).json({ msg: "Email đã được sử dụng!" });
    }

    return res.status(500).json({ msg: err.message || "Server Error" });
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

exports.getStudentsForTeacher = async (req, res) => {
  try {
    const teacherId = req.user.teacher_id; // lấy từ token (authMiddleware)
    const { class_id } = req.query;

    if (!class_id) {
      return res.status(400).json({ msg: "Missing class_id" });
    }

    // ✅ kiểm tra giáo viên có được phân công dạy lớp này không (theo bất kỳ môn nào)
    const assignment = await Assignment.findOne({
      where: { teacher_id: teacherId, class_id },
    });

    if (!assignment) {
      return res.status(403).json({ msg: "Bạn không có quyền xem lớp này" });
    }

    // ✅ lấy danh sách học sinh trực tiếp từ bảng students
    const students = await Student.findAll({
      where: { class_id },
      attributes: [
        "id",
        "student_code",
        "full_name",
        "gender",
        "date_of_birth",
        "status",
      ],
      order: [["student_code", "ASC"]],
    });

    res.json(
      students.map((s) => ({
        student_id: s.id,
        student_code: s.student_code,
        full_name: s.full_name,
        gender: s.gender,
        dob: s.date_of_birth, // hoặc đổi tên key thành date_of_birth cho thống nhất
        status: s.status,
      }))
    );
  } catch (error) {
    console.error("❌ ERROR getStudentsForTeacher:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};
