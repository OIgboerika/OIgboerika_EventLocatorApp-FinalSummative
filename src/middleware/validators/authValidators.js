const { body } = require("express-validator");

const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long"),
  body("location")
    .optional()
    .isObject()
    .withMessage("Location must be an object with coordinates"),
  body("preferredCategories")
    .optional()
    .isArray()
    .withMessage("Preferred categories must be an array"),
  body("preferredLanguage")
    .optional()
    .isString()
    .withMessage("Preferred language must be a string"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateProfileValidation = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long"),
  body("location")
    .optional()
    .isObject()
    .withMessage("Location must be an object with coordinates"),
  body("preferredCategories")
    .optional()
    .isArray()
    .withMessage("Preferred categories must be an array"),
  body("preferredLanguage")
    .optional()
    .isString()
    .withMessage("Preferred language must be a string"),
];

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation,
};
