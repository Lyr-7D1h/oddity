'use strict'

module.exports = async fastify => {
  fastify.get('/forum', (request, reply) => {
    fastify.models.forumCategory
      .findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [
          {
            model: fastify.models.forumThread,
            as: 'threads',
            include: {
              model: fastify.models.forumPost,
              as: 'latestPost',
              limit: 1
            }
          }
        ]
      })
      .then(result => {
        reply.send(result)
      })
      .catch(err => {
        fastify.log.error(err)
        reply.internalServerError()
      })
  })

  fastify.get('/forum/categories', (request, reply) => {
    fastify.models.forumCategory
      .findAll()
      .then(categories => {
        reply.send(categories)
      })
      .catch(err => {
        fastify.log.error(err)
        reply.internalServerError()
      })
  })

  fastify.get('/forum/threads', (request, reply) => {
    fastify.models.forumThread
      .findAll()
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
