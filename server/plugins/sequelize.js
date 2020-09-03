const fp = require('fastify-plugin')
const pg = require('pg')
const Sequelize = require('sequelize')

const preRun = (host, user, password, database) => {
  const client = new pg.Client({
    host,
    user,
    password,
    database: 'postgres', // Using default db to authenticate against
  })

  return new Promise((resolve, reject) => {
    client
      .connect()
      .then(() => {
        // No IF EXISTS for postgres so ignoring error for duplicate db
        client
          .query(`CREATE DATABASE ${database}`)
          .then(() => {
            client.end()
            resolve()
          })
          .catch((err) => {
            client.end()
            // If database already exists do continue
            if (err.code === '42P04') {
              resolve()
            }

            reject(err)
          })
      })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = fp(
  (instance, opts, done) => {
    const HOST = instance.config.DB_HOST || 'localhost'
    const DATABASE = instance.config.DB_NAME || 'oddity'
    const USERNAME = instance.config.DB_USERNAME || 'oddity'
    const PASSWORD = instance.config.DB_PASSWORD

    const sequelizeOpts = {
      host: HOST,
      dialect: 'postgres',
      pool: {
        max: 5,
        min: 0,
        idle: 1000, // Smaller idle time to increase tests speed (in ms)
      },
    }

    if (
      instance.config.DB_LOGGING_ENABLED === false ||
      instance.config.DB_LOGGING_ENABLED === undefined
    ) {
      sequelizeOpts.logging = false
    }

    preRun(HOST, USERNAME, PASSWORD, DATABASE)
      .then(() => {
        const sequelize = new Sequelize(
          DATABASE,
          USERNAME,
          PASSWORD,
          sequelizeOpts
        )

        // first check database by authenticating to it
        sequelize
          .authenticate()
          .then(() => {
            instance.log.info(
              `Connected to Postgres postgresql://${USERNAME}:{PASSWORD}@${HOST}/${DATABASE}`
            )

            instance.decorate('db', sequelize)
            instance.decorate('Sequelize', Sequelize)

            instance.addHook('onClose', (fastify, done) => {
              fastify.db
                .close()
                .then(() => {
                  done()
                })
                .catch((err) => {
                  instance.log.error(err)
                  done()
                })
            })
            done()
          })
          .catch((err) => {
            console.error(err)
            instance.log.fatal(err)
            throw err
          })
      })
      .catch((err) => {
        throw err
      })
  },
  {
    name: 'sequelize',
  }
)
