'use strict'
module.exports = (sequelize, DataTypes) => {
  const module = sequelize.define(
    'module',
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        isAlphanumeric: true
      },
      version: {
        type: DataTypes.STRING,
        allowNull: false,
        is: /^(\d+\.)?(\d+\.)?(\*|\d+)$/i
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    },
    {}
  )
  module.associate = function(models) {
    // associations can be defined here
    module.hasMany(models.route)
  }
  return module
}
