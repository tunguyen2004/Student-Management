// src/controllers/classController.js
const { Class, Teacher, User, Student } = require("../models");

async function generateClassCode(grade) {
  const count = await Class.count({ where: { grade } });
  return `${grade}A${count + 1}`;
}
const { Op } = require("sequelize");

function normalizeClassName(name) {
  return name
    .toLowerCase()
    .replace(/^lớp\s*/g, "") // bỏ chữ "lớp"
    .replace(/\s+/g, "") // bỏ tất cả khoảng trắng
    .toUpperCase(); // viết hoa
}

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
          include: [{ model: User, attributes: ["full_name"] }],
        },
        {
          model: Student,
          attributes: ["id"], // chỉ cần đếm số lượng
        },
      ],
      order: [
        ["school_year", "DESC"],
        ["grade", "ASC"],
        ["class_name", "ASC"],
      ],
    });

    // 🎯 Convert to JSON + gắn thêm student_count
    const result = classes.map((cls) => {
      const data = cls.toJSON();
      data.student_count = data.Students ? data.Students.length : 0;
      delete data.Students;
      return data;
    });

    res.json(result);
  } catch (err) {
    console.error(err);
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
  try {
    const {
      class_name,
      grade,
      school_year,
      homeroom_teacher_id,
      room_number,
      max_students,
      status,
    } = req.body;

    if (!class_name || !grade || !school_year) {
      return res.status(400).json({
        msg: "Vui lòng nhập class_name, grade, school_year",
      });
    }

    // 🎯 Chuẩn hoá tên để check trùng
    const normalized = normalizeClassName(class_name);

    const exists = await Class.findOne({
      where: { normalized_name: normalized },
    });

    if (exists) {
      return res.status(400).json({ msg: "Tên lớp đã tồn tại!" });
    }

    // 🎯 Sinh mã lớp theo khối
    const class_code = await generateClassCode(grade);

    const newClass = await Class.create({
      class_code,
      class_name,
      normalized_name: normalized,
      grade,
      school_year,
      homeroom_teacher_id: homeroom_teacher_id || null,
      room_number,
      max_students,
      status: status || "active",
      current_students: 0,
    });

    res.status(201).json(newClass);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Admin
exports.updateClass = async (req, res) => {
  const { id } = req.params;
  const { class_name } = req.body;

  try {
    const singleClass = await Class.findByPk(id);
    if (!singleClass) {
      return res.status(404).json({ msg: "Class not found" });
    }

    // 🎯 Nếu có sửa class_name → check trùng
    if (class_name) {
      const normalized = normalizeClassName(class_name);

      const exists = await Class.findOne({
        where: {
          normalized_name: normalized,
          id: { [Op.ne]: id },
        },
      });

      if (exists) {
        return res.status(400).json({ msg: "Tên lớp đã tồn tại!" });
      }

      req.body.normalized_name = normalized;
    }

    const updated = await singleClass.update(req.body);

    res.json(updated);
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
