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
        method: 'post',
        auth: [fastify.verify.cookie, fastify.verify.basic.user]
      },
      {
        method: 'delete',
        auth: fastify.verify.cookie
      },
      {
        method: 'put',
        auth: fastify.verify.cookie
      }
    ]
  }
  fastify.routeGen(roleRoute)
}
