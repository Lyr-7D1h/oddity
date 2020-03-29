module.exports = async fastify => {
  /*
   * Might want to add this later
   */
  // const handler = (request, reply) => {
  //   const { categoryTitle, threadTitle, postTitle } = request.params;
  //   const replacements = {};
  //   let selectQuery = '*, "threads".*, "posts".*';
  //   let joinQuery = "";
  //   let searchQuery = 'WHERE "forumCategories"."title" = :category';
  //   replacements.category = categoryTitle;
  //   if (threadTitle) {
  //     selectQuery = '*, "threads".*';
  //     joinQuery =
  //       'RIGHT OUTER JOIN "forumThreads" AS "threads" ON "forumCategories"."id" = "threads"."categoryId"';
  //     searchQuery = 'WHERE "threads"."title" = :thread';
  //     replacements.thread = threadTitle;
  //     if (postTitle) {
  //       selectQuery = '"posts"."id" AS "id"';
  //       joinQuery +=
  //         ' RIGHT OUTER JOIN "forumPosts" AS "posts" ON "threads"."id" = "posts"."threadId"';
  //       searchQuery = 'WHERE "posts"."title" = :post';
  //       replacements.post = postTitle;
  //     }
  //   }
  //   const query = `SELECT ${selectQuery} FROM "forumCategories" ${joinQuery} ${searchQuery} LIMIT 1`;
  //   fastify.db
  //     .query(query, { replacements })
  //     .then(([result]) => {
  //       if (result[0]) {
  //         reply.send(result[0]);
  //       } else {
  //         reply.notFound();
  //       }
  //     })
  //     .catch(err => {
  //       fastify.log.error(err);
  //       fastify.sentry.captureException(err);
  //       reply.internalServerError();
  //     });
  // };
  // fastify.get(
  //   "/forum/find/:categoryTitle/:threadTitle/:postTitle",
  //   {
  //     params: {
  //       type: "object",
  //       required: ["categoryTitle", "postTitle", "threadTitle"],
  //       properties: {
  //         categoryTitle: { type: "string" },
  //         threadTitle: { type: "string" },
  //         postTitle: { type: "string" }
  //       }
  //     }
  //   },
  //   handler
  // );
  fastify.get(
    "/forum/find/:categoryTitle/:threadTitle",
    {
      params: {
        type: "object",
        required: ["categoryTitle", "threadTitle"],
        properties: {
          categoryTitle: { type: "string" },
          threadTitle: { type: "string" }
        }
      }
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
                include: [
                  {
                    model: fastify.models.user,
                    as: "author",
                    attributes: ["identifier", "username"]
                  }
                ]
              }
            }
          ]
        })
        .then(category => {
          return reply.send(category);
        })
        .catch(err => {
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
          categoryTitle: { type: "string" }
        }
      }
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
                    attributes: ["identifier", "username"]
                  }
                ],
                limit: 1
              }
            }
          ]
        })
        .then(category => {
          return reply.send(category);
        })
        .catch(err => {
          console.error(err);
          fastify.log.error(err);
          return reply.internalServerError(err.message);
        });
    }
  );
};
