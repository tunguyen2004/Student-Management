// src/models/subjectModel.js
module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define(
    "Subject",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subject_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      subject_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hours_per_week: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
      },
      is_elective: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
    },
    {
      tableName: "subjects",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Subject.associate = (models) => {
    Subject.hasMany(models.Assignment, { foreignKey: "subject_id" });
    Subject.hasMany(models.Attendance, { foreignKey: "subject_id" });
  };

  return Subject;
};
