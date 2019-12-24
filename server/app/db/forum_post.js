const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const commentSchema = new instance.mongoose.Schema({
    author: {
      type: instance.mongoose.Types.ObjectId,
      required: true
    },
    content: {
      type: String,
      required: true,
      min: 3,
      max: 1000
    }
  })
  const forumPostSchema = new instance.mongoose.Schema({
    title: {
      type: String,
      required: true,
      min: 3,
      max: 40
    },
    content: {
      type: String,
      required: true,
      min: 3,
      max: 5000
    },
    createdAt: {
      type: Date,
      required: true
    },
    author: {
      type: instance.mongoose.Types.ObjectId,
      required: true
    },
    comments: {
      type: [commentSchema]
    }
  })

  const forumPost = instance.mongoose.connection.model(
    'ForumPost',
    forumPostSchema
  )

  instance.decorate('ForumPost', forumPost)
})
