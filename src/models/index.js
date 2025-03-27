const User = require("./User");
const Event = require("./Event");
const Category = require("./Category");
const Rating = require("./Rating");
const Favorite = require("./Favorite");

// Event-Category associations (Many-to-Many)
Event.belongsToMany(Category, {
  through: "EventCategories",
  as: "categories",
});
Category.belongsToMany(Event, {
  through: "EventCategories",
  as: "events",
});

// User-Event associations
Event.belongsTo(User, {
  as: "creator",
  foreignKey: "creatorId",
});
User.hasMany(Event, {
  as: "createdEvents",
  foreignKey: "creatorId",
});

// User-Rating associations
User.hasMany(Rating, {
  as: "ratings",
  foreignKey: "userId",
});
Rating.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});

// Event-Rating associations
Event.hasMany(Rating, {
  as: "ratings",
  foreignKey: "eventId",
});
Rating.belongsTo(Event, {
  as: "event",
  foreignKey: "eventId",
});

// User-Favorite associations
User.belongsToMany(Event, {
  through: Favorite,
  as: "favoriteEvents",
  foreignKey: "userId",
});
Event.belongsToMany(User, {
  through: Favorite,
  as: "favoritedBy",
  foreignKey: "eventId",
});

module.exports = {
  User,
  Event,
  Category,
  Rating,
  Favorite,
};
