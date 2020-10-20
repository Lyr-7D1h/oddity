'use strict'

module.exports = async (fastify) => {
  const roleRoute = {
    model: fastify.models.role,
    routes: [
      {
        method: 'get',
        multiple: true,
        permissions: fastify.PERMISSIONS.PUBLIC,
      },
      {
        method: 'get',
        permissions: fastify.PERMISSIONS.PUBLIC,
      },
      {
        method: 'post',
        preHandler: fastify.authorization.cookie,
        permissions: [
          fastify.PERMISSIONS.ROOT,
          fastify.PERMISSIONS.MANAGE_ROLES,
        ],
      },
      {
        method: 'delete',
        preHandler: fastify.authorization.cookie,
        permissions: [
          fastify.PERMISSIONS.ROOT,
          fastify.PERMISSIONS.MANAGE_ROLES,
        ],
      },
      {
        method: 'patch',
        preHandler: fastify.authorization.cookie,
        permissions: [
          fastify.PERMISSIONS.ROOT,
          fastify.PERMISSIONS.MANAGE_ROLES,
        ],
      },
    ],
  }
  fastify.routeGen(roleRoute)
}
