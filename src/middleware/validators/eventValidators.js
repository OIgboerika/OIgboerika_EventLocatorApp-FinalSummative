const { body, query, param } = require("express-validator");

const createEventValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("location")
    .isObject()
    .withMessage("Location must be an object with coordinates")
    .custom((value) => {
      if (
        !value.coordinates ||
        !Array.isArray(value.coordinates) ||
        value.coordinates.length !== 2
      ) {
        throw new Error(
          "Location must have valid coordinates [longitude, latitude]"
        );
      }
      return true;
    }),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) < new Date()) {
        throw new Error("Start date must be in the future");
      }
      return true;
    }),
  body("endDate")
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive number"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
  body("categoryIds")
    .optional()
    .isArray()
    .withMessage("Category IDs must be an array"),
];

const updateEventValidation = [
  param("id").isUUID().withMessage("Invalid event ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("location")
    .optional()
    .isObject()
    .withMessage("Location must be an object with coordinates")
    .custom((value) => {
      if (
        !value.coordinates ||
        !Array.isArray(value.coordinates) ||
        value.coordinates.length !== 2
      ) {
        throw new Error(
          "Location must have valid coordinates [longitude, latitude]"
        );
      }
      return true;
    }),
  body("address")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Address cannot be empty"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (
        req.body.startDate &&
        new Date(value) <= new Date(req.body.startDate)
      ) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive number"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
  body("status")
    .optional()
    .isIn(["draft", "published", "cancelled", "completed"])
    .withMessage("Invalid status"),
  body("categoryIds")
    .optional()
    .isArray()
    .withMessage("Category IDs must be an array"),
];

const searchNearbyValidation = [
  query("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
  query("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
  query("radius")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Radius must be a non-negative number"),
];

const getEventsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  query("search").optional().isString().withMessage("Search must be a string"),
  query("status")
    .optional()
    .isIn(["draft", "published", "cancelled", "completed"])
    .withMessage("Invalid status"),
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),
];

module.exports = {
  createEventValidation,
  updateEventValidation,
  searchNearbyValidation,
  getEventsValidation,
};
