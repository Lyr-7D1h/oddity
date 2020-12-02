"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("modules", [
      {
        name: "Home",
        title: "Home",
        identifier: "home",
        enabled: true,
        version: "0.0.1",
        route: "",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("modules", [
      {
        name: "Home",
      },
    ]);
  },
};
