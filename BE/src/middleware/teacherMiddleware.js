module.exports = (req, res, next) => {
  console.log("🔎 CHECK teacherMiddleware → req.user =", req.user);

  if (!req.user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  if (req.user.role !== "teacher") {
    console.log("⛔ BLOCKED: Role =", req.user.role);
    return res
      .status(403)
      .json({ msg: "Access denied. Teacher role required." });
  }
  console.log("TEACHER MIDDLEWARE → role =", req.user.role);

  console.log("✅ teacherMiddleware PASSED");
  next();
};
