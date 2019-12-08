module.exports = async fastify => {
  // fastify.routeGen({
  //   model: fastify.Config,
  //   routes: [
  //     {
  //       method: 'get',
  //       multiple: true
  //     },
  //     {
  //       method: 'get'
  //     },
  //     {
  //       method: 'post',
  //       auth: fastify.verify.cookie
  //     },
  //     {
  //       method: 'delete',
  //       auth: fastify.verify.cookie
  //     },
  //     {
  //       method: 'put',
  //       auth: [fastify.verify.cookie, fastify.verify.basic.user]
  //     }
  //   ]
  // })

  fastify.put(
    '/configs/:id/routes',
    {
      schema: {
        params: 'id#',
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            route: { type: 'string' },
            module: { type: 'string' },
            default: { type: 'boolean' }
          },
          required: ['name', 'route', 'module']
        }
      },
      preHandler: [
        fastify.validation.Id,
        fastify.auth([fastify.verify.cookie, fastify.verify.basic.user])
      ]
    },
    (request, response) => {
      fastify.Config.findById(request.params.id).then(config => {
        if (config === null) {
          return response.notFound()
        }

        let routes = config.routes

        // only one route can be default inside of document
        if (request.body.default) {
          for (const i in routes) {
            if (routes[i].default && routes[i]._id != request.body._id) {
              return response.badRequest('Only one route can be default')
            }
          }
        } else {
          // if not default route cannot be empty
          if (request.body.route == '') {
            return response.badRequest(
              'Only default route can have a empty path'
            )
          }
        }

        // route should be unique unless it is default
        for (const i in routes) {
          if (!routes[i].default) {
            if (routes[i].route === request.body.route) {
              return response.badRequest('Route must be unqiue')
            }
          }
        }

        // if '_id' in request replace document else create document
        if (request.body._id) {
          let found = false
          for (const i in routes) {
            const { _id } = routes[i]
            // replace if found
            if (_id == request.body._id) {
              found = true
              routes.splice(i, 1, request.body)
            }
          }
          if (!found) {
            routes.push(request.body)
          }
        } else {
          routes.push(request.body)
        }

        let defaultCount = 0
        for (const i in routes) {
          if (routes[i].default) {
            defaultCount++
          }
        }
        if (defaultCount === 0) {
          return response.badRequest('There should always be one default')
        }

        config
          .save()
          .then(() => {
            response.success()
          })
          .catch(err => {
            fastify.log.error(err)
            response.badRequest()
          })
      })
    }
  )

  // fastify.Config.create({
  //   name: 'test',
  //   isActive: true,
  //   title: 'Test',
  //   routes: [
  //     { name: 'Home', route: '', module: 'home', default: true },
  //     { name: 'Forum', route: 'forum', module: 'forum' },
  //     { name: 'Members', route: 'members', module: 'members' },
  //     { name: 'Servers', route: 'servers', module: 'servers' }
  //   ]
  // })
  //   .then(() => console.log('success'))
  //   .catch(err => {
  //     console.error(err)
  //   })

  // Get Default Config
  fastify.get('/config', (request, reply) => {
    fastify.Config.findOne({ isActive: true })
      .then(config => {
        reply.send(config)
      })
      .catch(err => {
        fastify.log.error(err)
        reply.send(fastify.httpErrors.internalServerError())
      })
  })
}
