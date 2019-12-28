const fp = require('fastify-plugin')
const Sequelize = require('sequelize')

module.exports = fp(async instance => {
  const HOST = instance.config.DB_HOST || 'localhost'
  const DATABASE = instance.config.DB_NAME || 'oddity'
  const USERNAME = instance.config.DB_USERNAME || 'oddity'
  const PASSWORD = instance.config.DB_PASS

  const sequelizeOpts = {
    host: HOST,
    dialect: 'postgres'
  }

  if (
    instance.config.DB_LOGGING_ENABLED === false ||
    instance.config.DB_LOGGING_ENABLED === undefined
  )
    sequelizeOpts.logging = false

  const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, sequelizeOpts)

  // first check database by authenticating to it
  try {
    await sequelize.authenticate()
    instance.decorate('db', sequelize)
    instance.decorate('Sequelize', Sequelize)
    instance.addHook('onClose', (fastify, done) => {
      fastify.db
        .close()
        .then(done)
        .catch(done)
    })
    instance.log.info(
      `Connected to Postgres postgresql://${USERNAME}:{PASSWORD}@${HOST}/${DATABASE}`
    )
  } catch (err) {
    instance.log.fatal(err)
    process.exit(1)
  }
})
