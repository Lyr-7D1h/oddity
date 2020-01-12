'use strict'

module.exports = async fastify => {
  const roleRoute = {
    model: fastify.models.role,
    routes: [
      {
        method: 'get',
        multiple: true
      },
      {
        method: 'get'
      },
      {
        method: 'post',
        auth: fastify.authentication.cookie
      },
      {
        method: 'delete',
        auth: fastify.authentication.cookie
      },
      {
        method: 'put',
        auth: fastify.authentication.cookie
      }
    ]
  }
  fastify.routeGen(roleRoute)
}
