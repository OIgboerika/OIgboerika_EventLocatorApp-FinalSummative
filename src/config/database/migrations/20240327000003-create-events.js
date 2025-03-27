"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Events", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      location: {
        type: Sequelize.GEOMETRY("POINT"),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("draft", "published", "cancelled", "completed"),
        defaultValue: "draft",
      },
      averageRating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0,
      },
      totalRatings: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      creatorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add indexes
    await queryInterface.addIndex("Events", ["location"], {
      using: "GIST",
    });
    await queryInterface.addIndex("Events", ["startDate"]);
    await queryInterface.addIndex("Events", ["status"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Events");
  },
};
