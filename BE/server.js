require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/config/db");
const db = require("./src/models");
// const adminScoreRoutes = require("./src/routes/adminScoreRoutes");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/profile", require("./src/routes/profileRoutes"));
app.use("/api/teachers", require("./src/routes/teacherRoutes"));
app.use("/api/subjects", require("./src/routes/subjectRoutes"));
app.use("/api/classes", require("./src/routes/classRoutes"));
app.use("/api/students", require("./src/routes/studentRoutes"));
app.use("/api/assignments", require("./src/routes/assignmentRoutes"));
app.use("/api/attendance", require("./src/routes/attendanceRoutes"));
app.use("/api/scores", require("./src/routes/scoreRoutes"));
app.use("/api/admin/scores", require("./src/routes/adminRoute"));
app.use("/api/reports", require("./src/routes/reportRoutes"));
app.use("/api/reports", require("./src/routes/subjectReportRoutes"));

const PORT = process.env.PORT || 5000;

// Sync database and start server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
