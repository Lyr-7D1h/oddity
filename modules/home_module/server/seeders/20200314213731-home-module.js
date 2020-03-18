"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("modules", [
      {
        id: 1,
        name: "Home",
        enabled: true,
        version: "0.0.1",
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
