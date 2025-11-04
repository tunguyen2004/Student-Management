
const { User, Teacher, sequelize } = require('../models');

exports.getMyProfile = async (req, res) => {
  try {
    const userProfile = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Teacher,
        required: false
      }]
    });

    if (!userProfile) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(userProfile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateMyProfile = async (req, res) => {
  // Destructure allowed fields for the users table
  const { full_name, email, phone, address, date_of_birth, gender } = req.body;
  const userFields = { full_name, email, phone, address, date_of_birth, gender };

  // Destructure allowed fields for the teachers table
  const { specialization, degree, salary, bank_account, bank_name, notes } = req.body;
  const teacherFields = { specialization, degree, salary, bank_account, bank_name, notes };

  // Filter out undefined fields to only update what's provided
  Object.keys(userFields).forEach(key => userFields[key] === undefined && delete userFields[key]);
  Object.keys(teacherFields).forEach(key => teacherFields[key] === undefined && delete teacherFields[key]);

  try {
    const result = await sequelize.transaction(async (t) => {
      // Find user
      const user = await User.findByPk(req.user.id, { transaction: t });
      if (!user) {
        throw new Error('User not found');
      }

      // Update user fields if any were provided
      if (Object.keys(userFields).length > 0) {
        await user.update(userFields, { transaction: t });
      }

      // If user is a teacher and there are teacher-specific fields, update them
      if (user.role === 'teacher' && Object.keys(teacherFields).length > 0) {
        const teacher = await Teacher.findOne({ where: { user_id: req.user.id }, transaction: t });
        if (teacher) {
          await teacher.update(teacherFields, { transaction: t });
        }
      }

      // Re-fetch the full profile to return
      const updatedProfile = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Teacher, required: false }],
        transaction: t
      });

      return updatedProfile;
    });

    res.json(result);

  } catch (err) {
    console.error(err.message);
    if (err.message === 'User not found') {
        return res.status(404).json({ msg: err.message });
    }
    res.status(500).send('Server Error');
  }
};
