const { Student, Class } = require("../models");
const { Op } = require("sequelize");

// @desc    Get all students
// @route   GET /api/students
// @access  Admin
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        {
          model: Class,
          attributes: ["id", "class_code", "class_name"],
        },
      ],
      order: [["full_name", "ASC"]],
    });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Admin
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        {
          model: Class,
          attributes: ["id", "class_code", "class_name"],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Admin

exports.createStudent = async (req, res) => {
  const { full_name, date_of_birth, gender, class_id, enrollment_date } =
    req.body;

  // Kiểm tra field bắt buộc
  if (!full_name || !date_of_birth || !gender || !class_id) {
    return res.status(400).json({
      msg: "Vui lòng nhập đầy đủ: full_name, date_of_birth, gender, class_id",
    });
  }

  try {
    // ✅ Xác định năm nhập học
    const year = enrollment_date
      ? new Date(enrollment_date).getFullYear()
      : new Date().getFullYear(); // nếu không có thì lấy năm hiện tại

    const yearShort = year.toString().slice(-2); // lấy 2 số cuối (vd: 2025 -> "25")

    // ✅ Tìm học sinh cuối cùng của năm nhập học
    const lastStudent = await Student.findOne({
      where: {
        student_code: {
          [Op.like]: `HS${yearShort}-%`,
        },
      },
      order: [["id", "DESC"]],
    });

    let nextCode = `HS${yearShort}-0001`;

    if (lastStudent?.student_code) {
      const lastNumber = parseInt(lastStudent.student_code.split("-")[1]);
      const nextNumber = lastNumber + 1;
      nextCode = `HS${yearShort}-${nextNumber.toString().padStart(4, "0")}`;
    }

    // ✅ Tự sinh student_code
    req.body.student_code = nextCode;

    const newStudent = await Student.create(req.body);

    res.status(201).json(newStudent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Admin
// exports.updateStudent = async (req, res) => {
//   const { id } = req.params;

//   try {
//     let student = await Student.findByPk(id);
//     if (!student) {
//       return res.status(404).json({ msg: "Student not found" });
//     }

//     student = await student.update(req.body);

//     res.json(student);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// };

// PATCH /api/students/:id
exports.updateStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findByPk(id, {
      include: [{ model: Class }],
    });

    if (!student) return res.status(404).json({ msg: "Student not found" });

    // ✅ Danh sách trường được phép chỉnh sửa
    const updatableFields = [
      "full_name",
      "date_of_birth",
      "gender",
      "email",
      "phone",
      "address",
      "parent_name",
      "parent_phone",
      "enrollment_date",
      "class_id",
      "status",
      "notes",
    ];

    // Lọc req.body chỉ giữ các trường hợp lệ
    const updateData = {};
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    await student.update(updateData);

    return res.json({ msg: "Student updated successfully", student });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Admin
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    await student.destroy();

    res.json({ msg: "Student removed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get students by class
// @route   GET /api/students/class/:class_id
// @access  Admin
exports.getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.findAll({
      where: { class_id: req.params.class_id },
      include: [
        {
          model: Class,
          attributes: ["id", "class_code", "class_name"],
        },
      ],
      order: [["full_name", "ASC"]],
    });

    if (!students) {
      return res.status(404).json({ msg: "No students found for this class" });
    }

    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
