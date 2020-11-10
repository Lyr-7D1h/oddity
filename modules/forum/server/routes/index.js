"use strict";

module.exports = async (fastify) => {
  fastify.get(
    "/forum",
    {
      permissions: fastify.PERMISSIONS.PUBLIC,
    },
    (request, reply) => {
      fastify.models.forumCategory
        .findAll({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          order: [["order", "ASC"]],
          include: [
            {
              model: fastify.models.forumThread,
              as: "threads",
              order: [["order", "ASC"]],
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              include: {
                model: fastify.models.forumPost,
                as: "latestPost",
                order: [["createdAt", "ASC"]],
                include: [
                  {
                    model: fastify.models.user,
                    as: "author",
                    attributes: ["identifier", "username", "roleId"],
                  },
                ],
                limit: 1,
              },
            },
          ],
        })
        .then((result) => {
          return reply.send(result);
        })
        .catch((err) => {
          fastify.log.error(err);
          fastify.sentry.captureException(err);
          return reply.internalServerError();
        });
    }
  );

  fastify.get(
    "/forum/categories",
    {
      permissions: fastify.PERMISSIONS.PUBLIC,
    },
    (request, reply) => {
      fastify.models.forumCategory
        .findAll({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          order: [["order", "ASC"]],
        })
        .then((categories) => {
          return reply.send(categories);
        })
        .catch((err) => {
          fastify.log.error(err);
          fastify.sentry.captureException(err);
          return reply.internalServerError();
        });
    }
  );

  fastify.get(
    "/forum/threads",
    {
      permissions: fastify.PERMISSIONS.PUBLIC,
    },
    (request, reply) => {
      fastify.models.forumThread
        .findAll({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          order: [["order", "ASC"]],
        })
        .then((threads) => {
          return reply.send(threads);
        })
        .catch((err) => {
          fastify.log.error(err);
          fastify.sentry.captureException(err);
          return reply.internalServerError();
        });
    }
  );

  // fastify.get(
  //   "/forum/categories/:id",
  //   {
  //     schema: {
  //       params: "id#",
  //     },
  //     permissions: fastify.PERMISSIONS.PUBLIC,
  //   },
  //   (request, reply) => {
  //     fastify.models.forumCategory
  //       .findOne({
  //         where: { id: request.params.id },
  //         attributes: {
  //           exclude: ["createdAt", "updatedAt"],
  //         },
  //         order: [["order", "ASC"]],
  //         include: [
  //           {
  //             model: fastify.models.forumThread,
  //             attributes: {
  //               exclude: ["createdAt", "updatedAt"],
  //             },
  //             as: "threads",
  //             include: {
  //               model: fastify.models.forumPost,
  //               as: "latestPost",
  //               order: [["createdAt", "ASC"]],
  //               include: [
  //                 {
  //                   model: fastify.models.user,
  //                   as: "author",
  //                   attributes: ["identifier", "username"],
  //                 },
  //               ],
  //               limit: 1,
  //             },
  //           },
  //         ],
  //       })
  //       .then((category) => {
  //         return reply.send(category);
  //       })
  //       .catch((err) => {
  //         fastify.log.error(err);
  //         fastify.sentry.captureException(err);
  //         return reply.internalServerError();
  //       });
  //   }
  // );

  // fastify.get(
  //   "/forum/threads/:id",
  //   {
  //     schema: {
  //       params: "id#",
  //     },
  //     permissions: fastify.PERMISSIONS.PUBLIC
  //   },
  //   (request, reply) => {
  //     fastify.models.forumThread
  //       .findOne({
  //         where: { id: request.params.id },
  //         attributes: {
  //           exclude: ["createdAt", "updatedAt"],
  //         },
  //         order: [["order", "ASC"]],
  //         include: {
  //           model: fastify.models.forumPost,
  //           as: "posts",
  //           order: [["createdAt", "ASC"]],
  //           include: [
  //             {
  //               model: fastify.models.user,
  //               as: "author",
  //               attributes: ["identifier", "username", "avatar"],
  //               include: { model: fastify.models.role, attributes: ["name"] },
  //             },
  //           ],
  //         },
  //       })
  //       .then((threads) => {
  //         reply.send(threads);
  //       })
  //       .catch((err) => {
  //         fastify.log.error(err);
  //         fastify.sentry.captureException(err);
  //         reply.internalServerError();
  //       });
  //   }
  // );

  // fastify.get(
  //   "/forum/posts/:id",
  //   {
  //     params: "id#",
  //   },
  //   (request, reply) => {
  //     fastify.models.forumPost
  //       .findOne({
  //         where: {
  //           id: request.params.id,
  //         },
  //         include: [
  //           {
  //             model: fastify.models.user,
  //             as: "author",
  //             attributes: ["identifier", "username", "roleId"],
  //           },
  //         ],
  //       })
  //       .then((posts) => {
  //         reply.send(posts);
  //       })
  //       .catch((err) => {
  //         fastify.log.error(err);
  //         fastify.sentry.captureException(err);
  //         reply.internalServerError();
  //       });
  //   }
  // );

  fastify.post(
    "/forum/categories",
    {
      schema: {
        type: "object",
      },
      permissions: [
        fastify.PERMISSIONS.ADMIN,
        fastify.PERMISSIONS.MANAGE_FORUM,
      ],
      preHandler: [fastify.auth([fastify.authorization.cookie])],
    },
    (request, reply) => {
      fastify.models.forumCategory
        .create(request.body)
        .then((category) => {
          return reply.send(category);
        })
        .catch((err) => {
          fastify.log.error(err);
          fastify.sentry.captureException(err);
          return reply.internalServerError();
        });
    }
  );
  fastify.post(
    "/forum/threads",
    {
      schema: {
        type: "object",
      },
      permissions: fastify.PERMISSIONS.ADMIN,
      preHandler: [fastify.auth([fastify.authorization.cookie])],
    },
    (request, reply) => {
      fastify.models.forumThread
        .create(request.body)
        .then((thread) => {
          reply.send(thread);
        })
        .catch((err) => {
          fastify.log.error(err);
          fastify.sentry.captureException(err);
          reply.internalServerError();
        });
    }
  );

  fastify.post(
    "/forum/categories-collection",
    {
      schema: {
        body: {
          type: "array",
        },
      },
      permissions: fastify.PERMISSIONS.ADMIN,
      preHandler: [fastify.auth([fastify.authorization.cookie])],
    },
    (request, reply) => {
      fastify.models.forumCategory.findAll().then((categories) => {
        const promises = [];

        // TODO: Fix loop updating
        categories.forEach((category) => {
          // if cant find delete category
          if (
            !request.body.includes(
              (reqCategory) => reqCategory.id && reqCategory.id === category.id
            )
          ) {
            promises.push(
              fastify.models.forumThread.destroy({
                where: { categoryId: category.id },
              })
            );
            promises.push(
              fastify.models.forumCategory.destroy({
                where: { id: category.id },
              })
            );
          }
        });

        request.body.forEach((category) => {
          promises.push(
            fastify.models.forumCategory.upsert(category, { returning: true })
          );
        });

        Promise.all(promises)
          .then((results) => {
            results = results.filter((result) => isNaN(result) && result); // filter out results of delete
            reply.send(results.map((result) => result[0]));
          })
          .catch((err) => {
            fastify.log.error(err);
            fastify.sentry.captureException(err);
            reply.internalServerError();
          });
      });
    }
  );

  fastify.post(
    "/forum/threads-collection",
    {
      schema: {
        body: {
          type: "array",
        },
      },
      permissions: fastify.PERMISSIONS.ADMIN,
      preHandler: [fastify.auth([fastify.authorization.cookie])],
    },
    (request, reply) => {
      fastify.models.forumThread.findAll().then((threads) => {
        const promises = [];

        // check if same title in same category
        const temp = [];
        request.body.forEach((thread) => {
          temp.forEach((tempThread) => {
            if (
              thread.title === tempThread.title &&
              tempThread.categoryId === thread.categoryId
            ) {
              return reply.badRequest(
                "Cannot have the same Thread Title for the same Category"
              );
            }
          });
          temp.push(thread);
        });

        // check if it needs to be deleted
        threads.forEach((thread) => {
          // if cant find delete thread
          if (
            !request.body.includes(
              (reqThread) => reqThread.id && reqThread.id === thread.id
            )
          )
            promises.push(
              fastify.models.forumThread.destroy({ where: { id: thread.id } })
            );
        });

        // update or create if not exists
        // TODO: Fix loop updating
        request.body.forEach((thread) => {
          promises.push(
            fastify.models.forumThread.upsert(thread, { returning: true })
          );
        });

        Promise.all(promises)
          .then((results) => {
            results = results.filter((result) => isNaN(result) && result); // filter out results of delete
            reply.send(results.map((result) => result[0]));
          })
          .catch((err) => {
            fastify.log.error(err);
            fastify.sentry.captureException(err);
            reply.internalServerError();
          });
      });
    }
  );
};
