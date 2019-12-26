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
  fastify.get('/forum/categories', (request, reply) => {
    fastify.ForumCategory.find({})
      .then(categories => {
        reply.send(categories)
      })
      .catch(err => {
        fastify.log.error(err)
        reply.internalServerError()
      })
  })
  fastify.get('/forum/threads', (request, reply) => {
    fastify.ForumThread.find({})
      .then(threads => {
        reply.send(threads)
      })
      .catch(err => {
        fastify.log.error(err)
        reply.internalServerError()
      })
  })
  fastify.put(
    '/forum/categories',
    {
      schema: {
        body: {
          type: 'array'
        }
      }
      // preHandler: [fastify.auth([fastify.verify.cookie])]
    },
    (request, reply) => {
      request.body = request.body.map(item => {
        if (!item._id) {
          item._id = new fastify.mongoose.Types.ObjectId()
        }
        return item
      })
      // TODO: Fix loop updating
      fastify.ForumCategory.updateMany({}, request.body, { upsert: true })
        .then(() => reply.send(request.body))
        .catch(err => {
          fastify.log.error(err)
          if (err.message) {
            reply.badRequest(err.message)
          } else {
            reply.badRequest()
          }
        })
    }
  )
  fastify.put(
    '/forum/threads',
    {
      schema: {
        body: {
          type: 'array'
        }
      }
      // preHandler: [fastify.auth([fastify.verify.cookie])]
    },
    (request, reply) => {
      // request.body = request.body.map(item => {
      //   if (!item._id) {
      //     item._id = new fastify.mongoose.Types.ObjectId()
      //   }
      //   return item
      // })

      console.log(request.body)
      // TODO: Fix loop updating

      fastify.ForumThread.updateMany({}, request.body, { upsert: true })
        .then(res => {
          console.log(res)
          reply.send(request.body)
        })
        .catch(err => {
          fastify.log.error(err)
          if (err.message) {
            reply.badRequest(err.message)
          } else {
            reply.badRequest()
          }
        })
    }
  )
}
