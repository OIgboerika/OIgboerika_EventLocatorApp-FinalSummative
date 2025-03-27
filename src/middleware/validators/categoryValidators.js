const { body, param } = require("express-validator");

const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must not exceed 200 characters"),
  body("icon").optional().isString().withMessage("Icon must be a string"),
  body("parentId")
    .optional()
    .isUUID()
    .withMessage("Invalid parent category ID"),
];

const updateCategoryValidation = [
  param("id").isUUID().withMessage("Invalid category ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must not exceed 200 characters"),
  body("icon").optional().isString().withMessage("Icon must be a string"),
  body("parentId")
    .optional()
    .isUUID()
    .withMessage("Invalid parent category ID"),
];

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
};
