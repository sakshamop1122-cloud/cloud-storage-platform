const { body, validationResult } = require("express-validator");
const { validateEmail, validatePassword } = require("../utils/helpers");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

const validateSignup = [
  body("email")
    .custom((value) => {
      if (!validateEmail(value)) {
        throw new Error("Invalid email format");
      }
      return true;
    })
    .toLowerCase(),
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage("Username can only contain letters, numbers, underscore, and hyphen"),
  body("password")
    .custom((value) => {
      if (!validatePassword(value)) {
        throw new Error(
          "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
        );
      }
      return true;
    }),
  body("firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name is required"),
  body("lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name is required"),
];

const validateLogin = [
  body("email")
    .custom((value) => {
      if (!validateEmail(value)) {
        throw new Error("Invalid email format");
      }
      return true;
    })
    .toLowerCase(),
  body("password").notEmpty().withMessage("Password is required"),
];

const validatePasswordReset = [
  body("email")
    .custom((value) => {
      if (!validateEmail(value)) {
        throw new Error("Invalid email format");
      }
      return true;
    })
    .toLowerCase(),
];

const validateNewPassword = [
  body("password")
    .custom((value) => {
      if (!validatePassword(value)) {
        throw new Error(
          "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
        );
      }
      return true;
    }),
  body("token").notEmpty().withMessage("Reset token is required"),
];

const validateFileUpload = [
  body("folderId")
    .optional()
    .isString()
    .withMessage("Folder ID must be a string"),
];

const validateFolderCreation = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Folder name must be 1-255 characters"),
  body("parentId")
    .optional()
    .isString()
    .withMessage("Parent folder ID must be a string"),
];

module.exports = {
  handleValidationErrors,
  validateSignup,
  validateLogin,
  validatePasswordReset,
  validateNewPassword,
  validateFileUpload,
  validateFolderCreation,
};
