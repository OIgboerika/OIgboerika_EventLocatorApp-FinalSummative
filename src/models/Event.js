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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        isValidLocation(value) {
          if (!value || !value.latitude || !value.longitude) {
            throw new Error("Location must have latitude and longitude");
          }
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    imageUrl: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "cancelled"),
      defaultValue: "draft",
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["category"],
      },
      {
        fields: ["date"],
      },
    ],
  }
);

module.exports = Event;
