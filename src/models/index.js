const { sequelize } = require("../config/database");
const User = require("./User");
const Event = require("./Event");
const Category = require("./Category");
const Rating = require("./Rating");
const Favorite = require("./Favorite");

// Define associations here
// Example: User.hasMany(Event)

module.exports = {
  sequelize,
  User,
  Event,
  Category,
  Rating,
  Favorite,
};
