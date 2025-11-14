module.exports = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ msg: "Access denied. Teacher only." });
  }
  next();
};
