
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  let token;
  // Check for token in Authorization header (Bearer <token>)
  if (req.header('authorization') && req.header('authorization').startsWith('Bearer ')) {
    token = req.header('authorization').split(' ')[1];
  } 
  // Fallback to checking for x-auth-token
  else if (req.header('x-auth-token')) {
    token = req.header('x-auth-token');
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
