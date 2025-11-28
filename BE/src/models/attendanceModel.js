// src/models/attendanceModel.js
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      attendance_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      session: {
        type: DataTypes.ENUM("morning", "afternoon", "all_day"),
        allowNull: false,
        defaultValue: "morning", // để vậy là an toàn hơn
      },

      status: {
        type: DataTypes.ENUM("present", "absent", "late", "excused"),
        allowNull: false,
        defaultValue: "present",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      recorded_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "attendances",
      timestamps: false, // vì bảng đang dùng created_at, không có updated_at
      underscored: true, // cột dùng snake_case
    }
  );

  // Nếu em muốn liên kết với Student, Class... có thể thêm (tùy tên model bên em):
  Attendance.associate = (models) => {
    // tên model có thể là Student / Class hoặc Students / Classes
    // chỉnh lại cho đúng nếu khác
    if (models.Student) {
      Attendance.belongsTo(models.Student, { foreignKey: "student_id" });
    }
    if (models.Class) {
      Attendance.belongsTo(models.Class, { foreignKey: "class_id" });
    }
  };

  return Attendance;
};
