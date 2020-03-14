"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("forumCategories", [
      {
        id: 1,
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
