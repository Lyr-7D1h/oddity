module.exports = (sequelize, DataTypes) => {
  const forumCategory = sequelize.define('forumCategory', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    }
  })
  forumCategory.associate = models => {
    forumCategory.hasMany(models.forumThread, {
      as: 'threads',
      foreignKey: 'categoryId'
    })
  }

  return forumCategory
}
