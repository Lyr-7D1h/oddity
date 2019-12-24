'use strict'

module.exports = async fastify => {
  fastify.get('/forum', async (request, reply) => {
    try {
      const categories = await fastify.ForumCategory.find({})
      const threads = await fastify.ForumThread.find({})
      const posts = await fastify.ForumPost.find({})

      const result = []
      for (let i in categories) {
        const catThreads = threads
          .filter(thread => thread.categoryId === categories[i]._id)
          .map(thread => {
            const threadPosts = posts
              .filter(post => post.threadId === thread._id)
              .sort(post => post.createdAt)
            if (threadPosts[0]) {
              thread.latestPost = threadPosts[0]
            }
            return thread
          })
        result.push({ title: categories[i].name, threads: catThreads })
      }
      reply.send(result)
    } catch (err) {
      fastify.log.error(err)
      reply.internalServerError()
    }
  })
}
