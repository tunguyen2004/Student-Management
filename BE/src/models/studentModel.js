module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    address: {
      type: DataTypes.STRING(255),
    },
    parent_name: {
      type: DataTypes.STRING(100),
    },
    parent_phone: {
      type: DataTypes.STRING(20),
    },
    enrollment_date: {
      type: DataTypes.DATE,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('studying', 'transferred', 'graduated', 'dropped'),
      defaultValue: 'studying',
    },
    notes: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'students',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Student.associate = (models) => {
    Student.belongsTo(models.Class, { foreignKey: 'class_id' });
    Student.hasMany(models.Attendance, { foreignKey: 'student_id' });
  };

  return Student;
};
