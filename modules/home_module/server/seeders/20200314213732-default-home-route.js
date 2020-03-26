"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("routes", [
      {
        name: "Home",
        path: "",
        default: true,
        moduleId: 1,
        configId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("routes", [
      {
        moduleId: 1
      }
    ]);
  }
};
