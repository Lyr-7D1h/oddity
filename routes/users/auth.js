const { Unauthorized } = require("http-errors")

module.exports = (fastify) => {
    fastify.post("/users/auth", (request, reply) => {
        console.log(request)
        if (request.body) {

        }
        reply.send(new Unauthorized())
    })
}