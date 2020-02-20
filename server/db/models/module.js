'use strict'
module.exports = (sequelize, DataTypes) => {
  const module = sequelize.define(
    'module',
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      version: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
      }
    },
    {}
  )
  module.associate = function(models) {
    // associations can be defined here
  }
  return module
}
