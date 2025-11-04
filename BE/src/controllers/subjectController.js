const { Subject } = require('../models');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Admin
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      order: [['subject_name', 'ASC']],
    });
    res.json(subjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get subject by ID
// @route   GET /api/subjects/:id
// @access  Admin
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({ msg: 'Subject not found' });
    }

    res.json(subject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Admin
exports.createSubject = async (req, res) => {
  const { subject_name, subject_code, description, credits, hours_per_week, is_elective, status } = req.body;

  // Basic validation
  if (!subject_name || !subject_code || !credits) {
    return res.status(400).json({ msg: 'Please provide subject_name, subject_code, and credits' });
  }

  try {
    // Check if subject_code already exists
    const subjectExists = await Subject.findOne({ where: { subject_code } });
    if (subjectExists) {
      return res.status(400).json({ msg: 'Subject code already exists' });
    }

    const newSubject = await Subject.create({
      subject_name,
      subject_code,
      description,
      credits,
      hours_per_week,
      is_elective,
      status,
    });

    res.status(201).json(newSubject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Admin
exports.updateSubject = async (req, res) => {
  const { id } = req.params;
  const { subject_name, subject_code, description, credits, hours_per_week, is_elective, status } = req.body;

  try {
    let subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ msg: 'Subject not found' });
    }

    // Check if subject_code is being changed and if the new one already exists
    if (subject_code && subject_code !== subject.subject_code) {
      const subjectExists = await Subject.findOne({ where: { subject_code } });
      if (subjectExists) {
        return res.status(400).json({ msg: 'Subject code already exists' });
      }
    }

    subject = await subject.update({
      subject_name: subject_name || subject.subject_name,
      subject_code: subject_code || subject.subject_code,
      description: description || subject.description,
      credits: credits || subject.credits,
      hours_per_week: hours_per_week || subject.hours_per_week,
      is_elective: is_elective || subject.is_elective,
      status: status || subject.status,
    });

    res.json(subject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Admin
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({ msg: 'Subject not found' });
    }

    await subject.destroy();

    res.json({ msg: 'Subject removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
