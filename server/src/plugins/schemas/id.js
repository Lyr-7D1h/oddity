const fp = require('fastify-plugin')

module.exports = fp(async (instance) => {
  instance.addSchema({
    $id: 'id',
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'number', description: 'Object ID' } },
  })
})
