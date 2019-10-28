const { Unauthorized } = require("http-errors")

module.exports = (fastify) => {
    console.log(fastify.auth)
    fastify.post("/users/auth", {
        preHandler: fastify.auth([
            fastify.verify.basic.portal,
            fastify.verify.basic.user
        ])
    }, (request, reply) => {
        // request.session.user = {name: }
    })
}