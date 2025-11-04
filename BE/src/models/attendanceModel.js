const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Attendance = sequelize.define('Attendance', {
    attendance_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    student_id: {
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
    attendance_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    session: {
      type: DataTypes.ENUM('morning', 'afternoon', 'all_day'),
      defaultValue: 'all_day',
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
      defaultValue: 'present',
    },
    notes: {
      type: DataTypes.TEXT,
    },
    recorded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'attendances',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    uniqueKeys: {
      unique_attendance: {
        fields: ['student_id', 'attendance_date', 'session', 'subject_id'],
      },
    },
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Student, { foreignKey: 'student_id' });
    Attendance.belongsTo(models.Class, { foreignKey: 'class_id' });
    Attendance.belongsTo(models.Subject, { foreignKey: 'subject_id' });
    Attendance.belongsTo(models.User, { foreignKey: 'recorded_by' });
  };

  return Attendance;
};