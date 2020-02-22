'use strict'
module.exports = (sequelize, DataTypes) => {
  const moduleRoute = sequelize.define(
    'moduleRoute',
    {
      moduleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      component: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  )
  moduleRoute.associate = function(models) {
    // associations can be defined here
    moduleRoute.belongsTo(models.module)
  }
  return moduleRoute
}
