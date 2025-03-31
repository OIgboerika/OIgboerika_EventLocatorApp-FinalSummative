const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerificationToken: DataTypes.STRING,
    emailVerificationExpires: DataTypes.DATE,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE,
    lastLogin: DataTypes.DATE,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    location: {
      type: DataTypes.JSONB,
      defaultValue: null,
      validate: {
        isValidLocation(value) {
          if (value) {
            // Handle coordinates array format
            if (
              value.coordinates &&
              Array.isArray(value.coordinates) &&
              value.coordinates.length === 2
            ) {
              value.latitude = value.coordinates[0];
              value.longitude = value.coordinates[1];
              delete value.coordinates;
              return;
            }
            // Handle direct latitude/longitude format
            if (!value.latitude || !value.longitude) {
              throw new Error("Location must have latitude and longitude");
            }
          }
        },
      },
    },
    preferredCategories: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    preferredLanguage: {
      type: DataTypes.STRING,
      defaultValue: "en",
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Instance method to compare password
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
