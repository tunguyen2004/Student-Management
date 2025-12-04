const jwt = require("jsonwebtoken");
const { User, Teacher } = require("../models");
console.log("📌 getTeacherAssignments =", typeof getTeacherAssignments);

module.exports = async function (req, res, next) {
  let token;

  if (
    req.header("authorization") &&
    req.header("authorization").startsWith("Bearer ")
  ) {
    token = req.header("authorization").split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy thông tin user và teacher_id từ DB
    const user = await User.findByPk(decoded.user.id, {
      include: [{ model: Teacher }], // Join để lấy thông tin giáo viên
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = {
      id: user.id,
      role: user.role,
      teacher_id: user.Teacher ? user.Teacher.id : null, // ✅ QUAN TRỌNG
    };
    console.log("🔥 AUTH CHECK:", req.user);
    console.log("AUTH MIDDLEWARE → req.user =", req.user);

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
