'use strict'
module.exports = (sequelize, DataTypes) => {
  const module = sequelize.define(
    'module',
    {
      name: DataTypes.STRING
    },
    {}
  )
  module.associate = function(models) {
    // associations can be defined here
  }
  return module
}
