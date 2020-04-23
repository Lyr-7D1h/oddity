module.exports = async (fastify) => {
  fastify.post(
    "/forum/posts",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            content: {
              type: "string",
            },
          },
          required: ["content"],
        },
      },
      permissions: [fastify.PERMISSIONS.NONE],
      preHandler: [fastify.auth([fastify.authentication.cookie])],
    },
    (request, reply) => {
      request.body.content = fastify.htmlSanitizer(request.body.content);
      fastify.models.forumPost
        .create(request.body)
        .then((post) => {
          return reply.send(post);
        })
        .catch((err) => {
          fastify.log.error(err);
          fastify.sentry.captureException(err);
          return reply.badRequest(err.message);
        });
    }
  );

  fastify.put(
    "/forum/posts/:id",
    {
      schema: {
        params: "id#",
        body: {
          type: "object",
        },
      },
      permissions: [fastify.PERMISSIONS.ROOT, fastify.PERMISSIONS.MANAGE_FORUM],
      preHandler: [fastify.auth([fastify.authentication.cookie])],
    },
    (request, reply) => {
      if (request.body.content) {
        request.body.content = fastify.htmlSanitizer(request.body.content);
      }
      fastify.models.forumPost
        .update(request.body, {
          where: { id: request.params.id },
          returning: true,
        })
        .then(([_, post]) => {
          return reply.send(post[0]);
        })
        .catch((err) => {
          fastify.log.error(err);
          fastify.sentry.captureException(err);
          return reply.badRequest(err.message);
        });
    }
  );

  fastify.delete(
    "/forum/posts/:id",
    {
      schema: { params: "id#" },
      permissions: fastify.PERMISSIONS.MANAGE_FORUM,
      preHandler: [fastify.auth([fastify.authentication.cookie])],
    },
    (request, reply) => {
      fastify.models.forumPost
        .destroy({ where: { id: request.params.id } })
        .then(() => {
          return reply.success();
        })
        .catch((err) => {
          return reply.internalServerError();
        });
    }
  );
};
