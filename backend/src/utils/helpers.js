const crypto = require("crypto");

const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const generateFileHash = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .substring(0, 255);
};

const getFileExtension = (fileName) => {
  return fileName.split(".").pop().toLowerCase();
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const isAllowedFileType = (mimeType) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || "").split(",");
  return allowedTypes.includes(mimeType);
};

const paginationParams = (page = 1, limit = 20) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  return { skip, take: limitNum, page: pageNum };
};

module.exports = {
  generateRandomToken,
  hashToken,
  generateFileHash,
  validateEmail,
  validatePassword,
  sanitizeFileName,
  getFileExtension,
  formatBytes,
  isAllowedFileType,
  paginationParams,
};
