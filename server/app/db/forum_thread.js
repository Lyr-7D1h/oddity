const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const forumThreadSchema = new instance.mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    categoryId: {
      type: instance.mongoose.Types.ObjectId,
      required: true
    }
  })

  const forumThread = instance.mongoose.connection.model(
    'ForumThread',
    forumThreadSchema
  )

  instance.decorate('ForumThread', forumThread)
})
