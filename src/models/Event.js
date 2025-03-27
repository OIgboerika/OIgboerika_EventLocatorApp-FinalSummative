const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "cancelled", "completed"),
      defaultValue: "draft",
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
    },
    totalRatings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    indexes: [
      {
        fields: ["location"],
        using: "GIST",
      },
      {
        fields: ["startDate"],
      },
      {
        fields: ["status"],
      },
    ],
  }
);

module.exports = Event;
