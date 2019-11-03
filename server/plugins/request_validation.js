const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  instance.addSchema({
    $id: 'id',
    required: ['id'],
    type: 'object',
    properties: { id: { type: 'string' } }
  })
})
