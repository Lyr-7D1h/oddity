"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("forumCategories", [
      {
        title: "Uncategorized",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("forumCategories", [
      {
        title: "Uncategorized"
      }
    ]);
  }
};
