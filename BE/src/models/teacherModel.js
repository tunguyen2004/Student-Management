module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    teacher_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    specialization: {
      type: DataTypes.STRING(100),
    },
    degree: {
      type: DataTypes.STRING(100),
    },
    start_date: {
      type: DataTypes.DATE,
    },
    salary: {
      type: DataTypes.DECIMAL(12, 2),
    },
    bank_account: {
      type: DataTypes.STRING(50),
    },
    bank_name: {
      type: DataTypes.STRING(100),
    },
    notes: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'teachers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Teacher.associate = (models) => {
    Teacher.belongsTo(models.User, { foreignKey: 'user_id' });
    Teacher.hasMany(models.Class, { foreignKey: 'homeroom_teacher_id' });
    Teacher.hasMany(models.Assignment, { foreignKey: 'teacher_id' });
  };

  return Teacher;
};
