module.exports = async (fastify) => {
  // TODO: test if works
  // Check if there is the same post with the same title in current thread
  const validateTitle = (threadId, title) => {
    return new Promise((resolve, reject) => {
      fastify.models.forumThread
        .findOne({
          where: { id: threadId },
          include: [
            {
              model: fastify.models.forumPost,
              as: "posts",
              where: { title: title },
            },
          ],
        })
        .then((thread) => resolve(thread.posts.length === 0))
        .catch((err) => reject(err));
    });
  };

  fastify.post(
    "/forum/posts",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            content: {
              type: "string",
            },
            threadId: {
              type: "integer",
            },
          },
          required: ["content", "threadId", "title"],
        },
      },
      permissions: [fastify.PERMISSIONS.NONE],
      preHandler: [fastify.auth([fastify.authentication.cookie])],
    },
    (request, reply) => {
      validateTitle
        .then((is_valid) => {
          if (!is_valid) {
            return reply.badRequest(
              "Cannot create post with the same name in current thread"
            );
          } else {
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
        })
        .catch((err) => {
          fastify.log.error(err);
          return reply.internalServerError("Could not find thread");
        });
    }
  );

  // TODO: check if works
  fastify.put(
    "/forum/posts/:id",
    {
      schema: {
        params: "id#",
        body: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            content: {
              type: "string",
            },
          },
        },
      },
      permissions: [fastify.PERMISSIONS.ROOT, fastify.PERMISSIONS.MANAGE_FORUM],
      preHandler: [fastify.auth([fastify.authentication.cookie])],
    },
    (request, reply) => {
      if (request.body.content) {
        request.body.content = fastify.htmlSanitizer(request.body.content);
      }

      const createPost = fastify.models.forumPost
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

      if (request.body.title) {
        if (request.body.threadId) {
          validateTitle(request.body.threadId, request.body.title);
        } else {
          fastify.models.forumPost
            .findOne({
              where: { id: request.params.id },
              attributes: { include: ["threadId"] },
            })
            .then((post) => {
              validateTitle(post.threadId, request.body.title).then(
                (is_valid) => {
                  if (is_valid) {
                    return reply.badRequest(
                      "Cannot create post with the same name in current thread"
                    );
                  } else {
                    createPost();
                  }
                }
              );
            })
            .catch((err) => {
              fastify.log.error(err);
              return fastify.reply.internalServerError();
            });
        }
      } else {
        createPost();
      }
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
