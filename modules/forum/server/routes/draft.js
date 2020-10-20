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

  fastify.get(
    "/forum/drafts/:id",
    {
      schema: {
        params: "id#",
      },
      permissions: fastify.PERMISSIONS.NONE,
      preHandler: fastify.auth([fastify.authorization.cookie]),
    },
    (request, reply) => {
      fastify.models.forumDraft
        .findOne({
          where: { authorId: request.session.user.id, id: request.params.id },
        })
        .then((draft) => reply.send(draft))
        .catch((err) => {
          fastify.sentry.captureException(err);
          fastify.log.error(err);
          reply.internalServerError("Could not get draft");
        });
    }
  );

  fastify.put(
    "/forum/drafts/:id",
    {
      schema: {
        params: "id#",
        body: {
          type: "object",
        },
      },
      permissions: fastify.PERMISSIONS.NONE,
      preHandler: [fastify.auth([fastify.authorization.cookie])],
    },
    (request, reply) => {
      fastify.models.forumDraft
        .update(request.body, {
          where: { id: request.params.id, authorId: request.session.user.id },
          returning: true,
        })
        .then(([_, draft]) => reply.send(draft[0]))
        .catch((err) => {
          fastify.log.error(err);
          return reply.internalServerError("Could not update draft");
        });
    }
  );

  fastify.delete(
    "/forum/drafts/:id",
    {
      schema: { params: "id#" },
      permissions: fastify.PERMISSIONS.NONE,
      preHandler: [fastify.auth([fastify.authorization.cookie])],
    },
    (request, reply) => {
      fastify.models.forumDraft
        .destroy({
          where: { id: request.params.id, authorId: request.session.user.id },
        })
        .then(() => {
          return reply.success();
        })
        .catch((err) => {
          fastify.log.error(err);
          return reply.internalServerError();
        });
    }
  );

  fastify.post(
    "/forum/drafts",
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
