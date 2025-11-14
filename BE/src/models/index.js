const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const db = {};

db.sequelize = sequelize;

// Import models
db.User = require("./userModel")(sequelize, DataTypes);
db.Teacher = require("./teacherModel")(sequelize, DataTypes);
db.Class = require("./classModel")(sequelize, DataTypes);
db.Subject = require("./subjectModel")(sequelize, DataTypes);
db.Student = require("./studentModel")(sequelize, DataTypes);
db.Assignment = require("./assignmentModel")(sequelize, DataTypes);
db.Attendance = require("./attendanceModel")(sequelize, DataTypes);
db.Score = require("./scoreModel")(sequelize, DataTypes);

// Define associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
