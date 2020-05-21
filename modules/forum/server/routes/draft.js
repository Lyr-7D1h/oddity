module.exports = async (fastify) => {
  fastify.get(
    "/forum/drafts",
    {
      permissions: fastify.PERMISSIONS.NONE,
      preHandler: fastify.auth([fastify.authorization.cookie]),
    },
    (request, reply) => {
      if (
        !request.session ||
        !request.session.user ||
        !request.session.user.id
      ) {
        return reply.badRequest("Could not find user");
      }

      fastify.models.forumDraft
        .findAll({ where: { authorId: request.session.user.id } })
        .then((drafts) => {
          return reply.send(drafts);
        })
        .catch((err) => {
          fastify.log.error(err);
          fastify.sentry.captureException(err);
          return reply.internalServerError();
        });
    }
  );

  fastify.post(
    "/forum/draft",
    {
      schema: {
        body: {
          type: "object",
        },
      },
      permissions: fastify.PERMISSIONS.NONE,
      preHandler: [fastify.auth([fastify.authorization.cookie])],
    },
    (request, reply) => {
      fastify.models.forumDraft
        .create(request.body)
        .then((draft) => {
          return reply.send(draft);
        })
        .catch((err) => {
          fastify.log.error(err);
          return reply.badRequest(err.message);
        });
    }
  );
};
