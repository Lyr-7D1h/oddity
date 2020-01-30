'use strict'

module.exports = async fastify => {
  const columns = 'name url'
  const portalRoute = {
    model: fastify.models.portal,
    routes: [
      {
        method: 'get',
        multiple: true,
        columns: columns
      },
      {
        method: 'get',
        columns: columns
      },
      {
        method: 'post'
      },
      {
        method: 'delete'
      },
      {
        method: 'patch'
      }
    ]
  }
  fastify.routeGen(portalRoute)
}
