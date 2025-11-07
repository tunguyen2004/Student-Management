module.exports = (sequelize, DataTypes) => {
  const Score = sequelize.define(
    "Score",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      student_id: { type: DataTypes.INTEGER, allowNull: false },
      subject_id: { type: DataTypes.INTEGER, allowNull: false },
      assignment_id: { type: DataTypes.INTEGER, allowNull: false },
      score_type: {
        type: DataTypes.ENUM("15ph", "45ph", "thi", "tbmon"),
        allowNull: false,
      },
      score: { type: DataTypes.DECIMAL(4, 2), allowNull: false },
      semester: { type: DataTypes.ENUM("1", "2"), allowNull: false },
      school_year: { type: DataTypes.STRING(9), allowNull: false },
      exam_date: { type: DataTypes.DATE },
      notes: { type: DataTypes.TEXT },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "scores",
      timestamps: true,
    }
  );

  Score.associate = (models) => {
    Score.belongsTo(models.Student, { foreignKey: "student_id" });
    Score.belongsTo(models.Subject, { foreignKey: "subject_id" });
    Score.belongsTo(models.Assignment, { foreignKey: "assignment_id" });
    Score.belongsTo(models.User, { foreignKey: "created_by" });
  };

  return Score;
};
