"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("EventCategories", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Categories",
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
    await queryInterface.addIndex(
      "EventCategories",
      ["eventId", "categoryId"],
      {
        unique: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("EventCategories");
  },
};
