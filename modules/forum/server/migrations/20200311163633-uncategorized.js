"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("forumCategories", [
      {
        title: "Uncategorized",
        order: 0,
        createdAt: Sequelize.fn("NOW"),
        updatedAt: Sequelize.fn("NOW"),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("forumCategories", [
      {
        title: "Uncategorized",
      },
    ]);
  },
};
