const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Protect routes
exports.protect = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, Authourixation denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "token is not valid" });
  }
};


