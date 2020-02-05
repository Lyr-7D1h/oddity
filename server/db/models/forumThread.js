module.exports = (sequelize, DataTypes) => {
  const forumThread = sequelize.define('forumThread', {
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
  forumThread.associate = models => {
    forumThread.belongsTo(models.forumCategory, {
      as: 'category',
      foreignKey: 'categoryId'
    })
    forumThread.hasMany(models.forumPost, {
      as: 'posts',
      foreignKey: 'threadId'
    })
    forumThread.hasMany(models.forumPost, {
      as: 'latestPost',
      foreignKey: 'threadId'
    })
  }

  return forumThread
}
