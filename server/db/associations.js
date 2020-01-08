module.exports = models => {
  // User
  models.user.hasMany(models.forumPost, {
    as: 'posts',
    foreignKey: 'authorId'
  })
  models.user.belongsTo(models.role)

  // Thread
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

  // Post
  models.forumPost.belongsTo(models.forumThread, {
    as: 'posts',
    foreignKey: 'threadId'
  })
  models.forumPost.belongsTo(models.user, {
    as: 'author',
    foreignKey: 'authorId'
  })

  // Category
  models.forumCategory.hasMany(models.forumThread, {
    as: 'threads',
    foreignKey: 'categoryId'
  })

  models.route.belongsTo(models.config)
  models.config.hasMany(models.route)
}
