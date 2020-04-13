'use strict'

module.exports = async (fastify) => {
  require('./identifier')(fastify)
  require('./preflight')(fastify)

  const excludeAttributes = [
    'password',
    'ip',
    'email',
    'createdAt',
    'updatedAt',
    'permissions',
  ]

  const userRoute = {
    model: fastify.models.user,
    routes: [
      {
        method: 'get',
        multiple: true,
        exclude: excludeAttributes,
        permissions: fastify.PERMISSIONS.NON_SET,
      },
      {
        method: 'get',
        exclude: excludeAttributes,
        permissions: fastify.PERMISSIONS.NON_SET,
      },
    ],
  }
  fastify.routeGen(userRoute)
}
