module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    assignment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semester: {
      type: DataTypes.ENUM('1', '2'),
      allowNull: false,
    },
    school_year: {
      type: DataTypes.STRING(9),
      allowNull: false,
    },
    teaching_schedule: {
      type: DataTypes.TEXT,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'cancelled'),
      defaultValue: 'active',
    },
  }, {
    tableName: 'assignments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    uniqueKeys: {
      unique_assignment: {
        fields: ['teacher_id', 'class_id', 'subject_id', 'semester', 'school_year'],
      },
    },
  });

  Assignment.associate = (models) => {
    Assignment.belongsTo(models.Teacher, { foreignKey: 'teacher_id' });
    Assignment.belongsTo(models.Class, { foreignKey: 'class_id' });
    Assignment.belongsTo(models.Subject, { foreignKey: 'subject_id' });
  };

  return Assignment;
};
