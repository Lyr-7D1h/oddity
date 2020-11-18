'use strict'

module.exports = (sequelize, DataTypes) => {
  const module = sequelize.define(
    'oddityMeta',
    {
      devShouldSeed: {
        type: DataTypes.BOOLEAN,
      },
      shouldSeed: {
        type: DataTypes.BOOLEAN,
      },
      latestMigration: {
        type: DataTypes.BIGINT,
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
