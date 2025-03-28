const { sequelize } = require("../config/database");
const User = require("./User");
const Event = require("./Event");
const Category = require("./Category");
const Rating = require("./Rating");
const Favorite = require("./Favorite");

// Define associations
User.hasMany(Event, { foreignKey: "organizer" });
Event.belongsTo(User, { foreignKey: "organizer" });

User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

Event.hasMany(Rating, { foreignKey: "eventId" });
Rating.belongsTo(Event, { foreignKey: "eventId" });

User.hasMany(Favorite, { foreignKey: "userId" });
Favorite.belongsTo(User, { foreignKey: "userId" });

Event.hasMany(Favorite, { foreignKey: "eventId" });
Favorite.belongsTo(Event, { foreignKey: "eventId" });

module.exports = {
  sequelize,
  User,
  Event,
  Category,
  Rating,
  Favorite,
};
