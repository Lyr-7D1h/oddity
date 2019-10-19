"use strict";
const { NotFound, ResourceNotFoundError, BadRequest } = require("http-errors");
const fp = require("fastify-plugin");

module.exports = fp(async function(instance) {
  instance.decorate("baseRoute", async (fastify, opts, { Model }) => {
    const collectionName = Model.collection.collectionName;
    fastify.log.info(`Controller for ${collectionName} initialized`);

    const validateId = (request, reply, next) => {
      console.log(next);
      try {
        new fastify.mongoose.ObjectId(request.params.id);
        return next();
      } catch (err) {
        console.log(err);
        reply.send(new BadRequest());
      }
    };

    /**
     * Read All
     */
    fastify.get(`/${collectionName}`, (request, reply) => {
      Model.find({})
        .then(items => {
          reply.send(items);
        })
        .catch(err => {
          fastify.log.error(err);
        });
    });

    /**
     * Read
     */
    fastify.get(
      `/${collectionName}/:id`,
      {
        schema: {
          params: "id#"
        }
      },
      validateId,
      (request, reply) => {
        console.log("FIND");
        Model.findById(request.params.id)
          .then(items => {
            reply.send(items);
          })
          .catch(err => {
            fastify.log.error(err);
            reply.send(new NotFound());
          });
      }
    );

    /**
     * Update
     */
    fastify.put(
      `/${collectionName}/:id`,
      {
        beforeHandler: [validateId],
        schema: {
          params: "id#"
        }
      },
      (request, reply) => {
        Model.updateOne({ _id: request.params.id }, request.body)
          .then(response => {
            if (response.nModified == 0) {
              return reply.send(new ResourceNotFoundError("nothing changed"));
            }
            return res.send({ message: "success" });
          })
          .catch(err => {
            fastify.log.error(err);
            return reply.send(new NotFound());
          });
      }
    );
  });
});
