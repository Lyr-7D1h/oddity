const fp = require("fastify-plugin");

module.exports = fp(async instance => {
  instance.decorateReply("example", function() {
    this.status(200).send({
      message: "This comes from an example plugin"
    });
  });
});
