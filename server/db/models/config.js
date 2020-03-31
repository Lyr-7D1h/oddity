'use strict'
module.exports = (sequelize, DataTypes) => {
  const config = sequelize.define(
    'config',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        isLowercase: true,
        unique: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  )
  config.associate = models => {}
  return config
}
