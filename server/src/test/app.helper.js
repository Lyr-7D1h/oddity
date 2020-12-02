'use strict'

const path = require('path')
const fastifyAutoload = require('fastify-autoload')
const fp = require('fastify-plugin')
const session = require('fastify-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const { routeDirs, pluginDirs } = require('../../module_loader_imports')

/**
 * A minified app object
 * Does not contain documentation, automatic migrations and seeding
 * @param {Object} opts
 */
module.exports = async (app, opts) => {
  app
    .register(require('fastify-sensible'))

    .register(require('fastify-cookie'))

    // Used for resources
    .register(require('fastify-multipart'), {
      limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 1000000, // Max field value (1MB)
        fields: 10, // Max number of non-file fields
        fileSize: 1000000, // For multipart forms (1MB)
        files: 1, // Max number of file fields (1 file at the time)
        headerPairs: 100, // Max number of header key=>value pairs
      },
    })

    .register(require('fastify-cors'), {
      origin: 'http://localhost:3000',
    })

    .register(require('fastify-auth'))

    // Autoload Plugins
    .register(fastifyAutoload, {
      dir: path.join(__dirname, '../plugins'),
      ignorePattern: /(migrations\.js)|(seeding\.js)|(modules_sync\.js)|(forwarder\.js)/g,
      options: Object.assign({}, opts),
    })

    // Session Storage to Postgres
    .register(
      fp(
        (instance, opts, done) => {
          opts.store = new SequelizeStore({
            db: instance.db,
            modelKey: 'session',
          })
          session(instance, opts, done)
          opts.store.sync()
        },
        {
          dependencies: ['sequelize'],
        }
      ),
      {
        secret: app.config.SESSION_SECRET,
        cookie: {
          httpOnly: !(app.config.NODE_ENV === 'development'), // set httpOnly and secure off when in dev
          secure: !(app.config.NODE_ENV === 'development'),
          expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // session is valid for 14 days
        },
      }
    )

    // Autoload Routes
    .register(fastifyAutoload, {
      dir: path.join(__dirname, '../routes'),
      options: Object.assign(
        {
          prefix: '/api',
        },
        opts
      ),
    })

  // Might remove in future
  pluginDirs.forEach((dir) => {
    app.register(fastifyAutoload, {
      dir: dir,
      options: Object.assign({
        opts,
      }),
    })
  })
  routeDirs.forEach((dir) => {
    app.register(fastifyAutoload, {
      dir: dir,
      options: Object.assign({
        prefix: '/api',
        opts,
      }),
    })
  })
}
