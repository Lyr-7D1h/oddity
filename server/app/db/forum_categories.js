const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const forumCategorySchema = new instance.mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    }
  })

  const forumCategory = instance.mongoose.connection.model(
    'ForumCategory',
    forumCategorySchema
  )

  instance.decorate('ForumCategory', forumCategory)
})
