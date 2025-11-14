module.exports = (sequelize, DataTypes) => {
  const ScoreSummary = sequelize.define(
    "ScoreSummary",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      student_id: { type: DataTypes.INTEGER, allowNull: false },
      subject_id: { type: DataTypes.INTEGER, allowNull: false },
      semester: { type: DataTypes.ENUM("1", "2"), allowNull: false },
      school_year: { type: DataTypes.STRING(9), allowNull: false },
      avg_15ph: DataTypes.DECIMAL(4, 2),
      avg_45ph: DataTypes.DECIMAL(4, 2),
      exam_score: DataTypes.DECIMAL(4, 2),
      subject_avg: DataTypes.DECIMAL(4, 2),
      rank_in_class: DataTypes.INTEGER,
      rank_in_grade: DataTypes.INTEGER,
    },
    {
      tableName: "score_summaries",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["student_id", "subject_id", "semester", "school_year"],
        },
      ],
    }
  );

  ScoreSummary.associate = (models) => {
    ScoreSummary.belongsTo(models.Student, { foreignKey: "student_id" });
    ScoreSummary.belongsTo(models.Subject, { foreignKey: "subject_id" });
  };

  return ScoreSummary;
};
