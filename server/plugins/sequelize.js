const fp = require('fastify-plugin')
const Sequelize = require('sequelize')

module.exports = fp(async instance => {
  const sequelize = new Sequelize({
    host: instance.config.DB_HOST || 'localhost',
    database: instance.config.DB_NAME || 'oddity',
    username: instance.config.DB_USERNAME || 'oddity',
    password: instance.config.DB_PASS || 'wekZ^mwdfLaPXk4pGM7z',

    dialect: 'postgres',
    logging: (...msg) => instance.log.info('[DB] ', msg)
  })

  // first check database by authenticating to it
  try {
    await sequelize.authenticate()
    instance.decorate('db', sequelize)
    instance.decorate('Sequelize', Sequelize)
    instance.addHook('onClose', (fastify, done) => {
      fastify.sequelize
        .close()
        .then(done)
        .catch(done)
    })
  } catch (err) {
    instance.log.fatal(err)
    process.exit(1)
  }
})
