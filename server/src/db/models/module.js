'use strict'
module.exports = (sequelize, DataTypes) => {
  const module = sequelize.define(
    'module',
    {
      identifier: {
        type: DataTypes.STRING,
        isLowercase: true,
        isAlphanumeric: true,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        isAlphanumeric: true,
      },
      version: {
        type: DataTypes.STRING,
        allowNull: false,
        is: /^(\d+\.)?(\d+\.)?(\*|\d+)$/i,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      route: {
        type: DataTypes.STRING,
        allowNull: false,
        isAlphanumeric: true,
        isLowercase: true,
        unique: true,
      },
    },
    {}
  )
  module.associate = function (models) {
    // associations can be defined here
  }
  return module
}
