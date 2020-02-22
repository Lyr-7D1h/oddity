'use strict'
module.exports = (sequelize, DataTypes) => {
  const module = sequelize.define(
    'module',
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        isAlphanumeric: true,
        isLowercase: true
      },
      version: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        is: /^(\d+\.)?(\d+\.)?(\*|\d+)$/i
      }
    },
    {}
  )
  module.associate = function(models) {
    // associations can be defined here
    module.hasMany(models.moduleRoute)
  }
  return module
}
