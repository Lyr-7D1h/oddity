"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("modules", [
      {
        name: "Home",
        enabled: true,
        version: "0.0.1",
        route: "",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("modules", [
      {
        name: "Home"
      }
    ]);
  }
};
