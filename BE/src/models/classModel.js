// src/models/classModel.js
module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define(
    "Class",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      class_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      class_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      grade: {
        type: DataTypes.ENUM("10", "11", "12"),
        allowNull: false,
      },
      school_year: {
        type: DataTypes.STRING(9),
        allowNull: false,
      },
      homeroom_teacher_id: {
        type: DataTypes.INTEGER,
      },
      room_number: {
        type: DataTypes.STRING(10),
      },
      max_students: {
        type: DataTypes.INTEGER,
        defaultValue: 40,
      },
      current_students: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      normalized_name: {
        type: DataTypes.STRING(50),
        unique: true,
      },
    },
    {
      tableName: "classes",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Class.associate = (models) => {
    Class.belongsTo(models.Teacher, { foreignKey: "homeroom_teacher_id" });
    Class.hasMany(models.Student, { foreignKey: "class_id" });
    Class.hasMany(models.Assignment, { foreignKey: "class_id" });
    Class.hasMany(models.Attendance, { foreignKey: "class_id" });
  };

  return Class;
};
