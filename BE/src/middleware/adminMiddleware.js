module.exports = function (req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Access denied. Admin role required." });
  }
  console.log("ADMIN MIDDLEWARE → role =", req.user.role);
};
