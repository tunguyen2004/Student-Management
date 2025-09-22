const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const hocSinhRoutes = require("./routes/hocsinh");
const diemRoutes = require("./routes/diem");

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/hocsinh", hocSinhRoutes);
app.use("/api/diem", diemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
