const { verifyAccessToken } = require("../utils/jwt");
const logger = require("../config/logger");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    logger.error("Authentication error:", error.message);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRole = req.userRole;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
};
