module.exports = async (fastify) => {
  fastify.get(
    "/forum/find/:categoryTitle/:threadTitle/:postTitle",
    {
      params: {
        type: "object",
        required: ["categoryTitle", "postTitle", "threadTitle"],
        properties: {
          categoryTitle: { type: "string" },
          threadTitle: { type: "string" },
          postTitle: { type: "string" },
        },
      },
      permissions: fastify.PERMISSIONS.PUBLIC,
    },
    (request, reply) => {
      fastify.models.forumCategory
        .findOne({
          where: { title: request.params.categoryTitle },
          include: [
            {
              model: fastify.models.forumThread,
              as: "threads",
              where: { title: request.params.threadTitle },
              limit: 1,
              include: {
                model: fastify.models.forumPost,
                as: "posts",
                order: [["createdAt", "ASC"]],
                where: { title: request.params.postTitle },
                limit: 1,
                include: [
                  {
                    model: fastify.models.user,
                    as: "author",
                    attributes: ["identifier", "username"],
                  },
                ],
              },
            },
          ],
        })
        .then((category) => {
          return reply.send(category);
        })
        .catch((err) => {
          console.error(err);
          fastify.log.error(err);
          return reply.internalServerError(err.message);
        });
    }
  );
  fastify.get(
    "/forum/find/:categoryTitle/:threadTitle",
    {
      schema: {
        params: {
          type: "object",
          required: ["categoryTitle", "threadTitle"],
          properties: {
            categoryTitle: { type: "string" },
            threadTitle: { type: "string" },
          },
        },
      },
      permissions: fastify.PERMISSIONS.PUBLIC,
    },
    (request, reply) => {
      fastify.models.forumCategory
        .findOne({
          where: { title: request.params.categoryTitle },
          include: [
            {
              model: fastify.models.forumThread,
              as: "threads",
              where: { title: request.params.threadTitle },
              // limit: 1,
              include: {
                model: fastify.models.forumPost,
                as: "posts",
                order: [["createdAt", "ASC"]],
                include: [
                  {
                    model: fastify.models.user,
                    as: "author",
                    attributes: ["identifier", "username"],
                    include: [
                      {
                        model: fastify.models.role,
                        as: "role",
                      },
                    ],
                  },
                ],
              },
            },
          ],
        })
        .then((category) => {
          return reply.send(category);
        })
        .catch((err) => {
          console.error(err);
          fastify.log.error(err);
          return reply.internalServerError(err.message);
        });
    }
  );
  fastify.get(
    "/forum/find/:categoryTitle",
    {
      params: {
        type: "object",
        required: ["categoryTitle"],
        properties: {
          categoryTitle: { type: "string" },
        },
      },
      permissions: fastify.PERMISSIONS.PUBLIC,
    },
    (request, reply) => {
      fastify.models.forumCategory
        .findOne({
          where: { title: request.params.categoryTitle },
          include: [
            {
              model: fastify.models.forumThread,
              as: "threads",
              include: {
                model: fastify.models.forumPost,
                as: "latestPost",
                order: [["createdAt", "ASC"]],
                include: [
                  {
                    model: fastify.models.user,
                    as: "author",
                    attributes: ["identifier", "username"],
                  },
                ],
                limit: 1,
              },
            },
          ],
        })
        .then((category) => {
          return reply.send(category);
        })
        .catch((err) => {
          console.error(err);
          fastify.log.error(err);
          return reply.internalServerError(err.message);
        });
    }
  );
};
