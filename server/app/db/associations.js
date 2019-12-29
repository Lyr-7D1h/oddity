module.exports = models => {
  models.forumThread.belongsTo(models.forumCategory, {
    as: 'category',
    foreignKey: 'categoryId'
  })
  models.forumThread.hasMany(models.forumPost, {
    as: 'posts',
    foreignKey: 'threadId'
  })
  models.forumThread.hasMany(models.forumPost, {
    as: 'latestPost',
    foreignKey: 'threadId'
  })

  models.forumPost.belongsTo(models.forumThread, {
    as: 'posts',
    foreignKey: 'threadId'
  })

  models.forumCategory.hasMany(models.forumThread, {
    as: 'threads',
    foreignKey: 'categoryId'
  })

  models.route.belongsTo(models.config)
  models.config.hasMany(models.route)
}
