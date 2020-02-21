const fp = require("../../server/fastify-plugin");

module.exports = fp(async instance => {
  console.log(instance);
  instance.decorateReply("example", function() {
    this.status(200).send({
      message: "This comes from an example plugin"
    });
  });
});
