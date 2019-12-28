'use strict'

module.exports = async fastify => {
  fastify.get('/forum', (request, reply) => {
    fastify.models.forumCategory
      .findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [['order', 'ASC']],
        include: [
          {
            model: fastify.models.forumThread,
            as: 'threads',
            order: [['order', 'ASC']],
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
      .findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [['order', 'ASC']]
      })
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
      .findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [['order', 'ASC']]
      })
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
      fastify.models.forumCategory.findAll().then(categories => {
        const promises = []

        // TODO: Fix loop updating
        categories.forEach(category => {
          // if cant find delete category
          if (
            !request.body.includes(
              reqCategory => reqCategory.id && reqCategory.id === category.id
            )
          ) {
            promises.push(
              fastify.models.forumThread.destroy({
                where: { categoryId: category.id }
              })
            )
            promises.push(
              fastify.models.forumCategory.destroy({
                where: { id: category.id }
              })
            )
          }
        })

        request.body.forEach(category => {
          promises.push(
            fastify.models.forumCategory.upsert(category, { returning: true })
          )
        })

        Promise.all(promises)
          .then(results => {
            results = results.filter(result => isNaN(result) && result) // filter out results of delete
            reply.send(results.map(result => result[0]))
          })
          .catch(err => {
            fastify.log.error(err)
            reply.internalServerError()
          })
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
      fastify.models.forumThread.findAll().then(threads => {
        const promises = []

        threads.forEach(thread => {
          // if cant find delete thread
          if (
            !request.body.includes(
              reqThread => reqThread.id && reqThread.id === thread.id
            )
          )
            promises.push(
              fastify.models.forumThread.destroy({ where: { id: thread.id } })
            )
        })

        // TODO: Fix loop updating
        request.body.forEach(thread => {
          promises.push(
            fastify.models.forumThread.upsert(thread, { returning: true })
          )
        })

        Promise.all(promises)
          .then(results => {
            results = results.filter(result => isNaN(result) && result) // filter out results of delete
            reply.send(results.map(result => result[0]))
          })
          .catch(err => {
            fastify.log.error(err)
            reply.internalServerError()
          })
      })
    }
  )
}
