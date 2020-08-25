'use strict'

module.exports = (sequelize, DataTypes) => {
  const module = sequelize.define(
    'oddityMeta',
    {
      devShouldSeed: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  )
  module.associate = function (models) {
    // associations can be defined here
  }
  return module
}
