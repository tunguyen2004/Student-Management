const { Student, Class } = require('../models');

// @desc    Get all students
// @route   GET /api/students
// @access  Admin
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [{
        model: Class,
        attributes: ['id', 'class_code', 'class_name']
      }],
      order: [['full_name', 'ASC']],
    });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Admin
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
        include: [{
            model: Class,
            attributes: ['id', 'class_code', 'class_name']
        }],
    });

    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Admin
exports.createStudent = async (req, res) => {
  const { student_code, full_name, date_of_birth, gender, class_id } = req.body;

  // Validation
  if (!student_code || !full_name || !date_of_birth || !gender || !class_id) {
    return res.status(400).json({ msg: 'Please provide student_code, full_name, date_of_birth, gender, and class_id' });
  }

  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Admin
exports.updateStudent = async (req, res) => {
  const { id } = req.params;

  try {
    let student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    student = await student.update(req.body);

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Admin
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    await student.destroy();

    res.json({ msg: 'Student removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get students by class
// @route   GET /api/students/class/:class_id
// @access  Admin
exports.getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.findAll({
      where: { class_id: req.params.class_id },
      include: [{
        model: Class,
        attributes: ['id', 'class_code', 'class_name']
      }],
      order: [['full_name', 'ASC']],
    });

    if (!students) {
      return res.status(404).json({ msg: 'No students found for this class' });
    }

    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
