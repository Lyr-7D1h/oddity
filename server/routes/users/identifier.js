'use strict'

module.exports = async (fastify) => {
  fastify.get(
    '/users/identifier/:identifier',
    {
      permissions: fastify.PERMISSIONS.NON_SET,
    },
    (request, reply) => {
      fastify.models.user
        .findOne({
          where: { identifier: request.params.identifier },
          attributes: {
            include: ['id', 'username', 'identifier', 'avatar', 'createdAt'],
          },
          include: [
            {
              model: fastify.models.role,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        })
        .then((user) => {
          return reply.send(user)
        })
        .catch((err) => {
          fastify.log.error(err)
          return reply.internalServerError(err)
        })
    }
  )
}
