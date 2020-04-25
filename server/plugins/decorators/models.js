const fp = require('fastify-plugin')
const fetchModels = require('../../db/models')
module.exports = fp(
  (instance, _, done) => {
    fetchModels(instance.db)
      .then((models) => {
        instance.decorate('models', models)
        done()
      })
      .catch((err) => {
        instance.log.error(err)
      })
  },
  {
    name: 'models',
    decorators: {
      fastify: ['db'],
    },
    dependencies: ['sequelize'],
  }
)
