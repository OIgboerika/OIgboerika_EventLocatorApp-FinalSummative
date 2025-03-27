const { body, param } = require("express-validator");

const addFavoriteValidation = [
  body("eventId").isUUID().withMessage("Invalid event ID"),
];

const removeFavoriteValidation = [
  param("eventId").isUUID().withMessage("Invalid event ID"),
];

module.exports = {
  addFavoriteValidation,
  removeFavoriteValidation,
};
