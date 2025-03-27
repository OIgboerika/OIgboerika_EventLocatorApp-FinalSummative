const { body, param } = require("express-validator");

const createRatingValidation = [
  body("eventId").isUUID().withMessage("Invalid event ID"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("review")
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Review must be between 10 and 500 characters"),
];

const updateRatingValidation = [
  param("id").isUUID().withMessage("Invalid rating ID"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("review")
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Review must be between 10 and 500 characters"),
];

module.exports = {
  createRatingValidation,
  updateRatingValidation,
};
