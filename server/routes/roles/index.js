'use strict'

module.exports = async fastify => {
  const roleRoute = {
    model: fastify.Role,
    routes: [
      {
        method: 'get',
        multiple: true
      },
      {
        method: 'get'
      },
      {
        method: 'post'
      },
      {
        method: 'delete'
      },
      {
        method: 'put'
      }
    ]
  }
  fastify.routeGen(roleRoute)
}
