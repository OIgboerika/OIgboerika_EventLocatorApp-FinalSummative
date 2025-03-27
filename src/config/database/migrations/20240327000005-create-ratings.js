"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Ratings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      review: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      eventId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Events",
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

    // Add unique constraint
    await queryInterface.addIndex("Ratings", ["userId", "eventId"], {
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Ratings");
  },
};
