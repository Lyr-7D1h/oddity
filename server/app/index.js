'use strict'

const path = require('path')
const fastifyAutoload = require('fastify-autoload')
const fp = require('fastify-plugin')
const session = require('fastify-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const { routeDirs, pluginDirs } = require('../module_loader_imports')

module.exports = async (fastify, opts) => {
  fastify
    .register(require('fastify-oas'), {
      routePrefix: '/documentation',
      exposeRoute: true,
      swagger: {
        info: {
          title: 'Oddity OpenAPI Documenation',
          description:
            'Here you have a good overview of our current API and how you could use it',
          version: '0.1.0',
        },
        externalDocs: {
          url: 'https://oddityservers.com/developer',
          description: 'Find more info here',
        },
        servers: [
          {
            url:
              fastify.config.NODE_ENV === 'development'
                ? 'http://localhost:5000'
                : '/',
          },
        ],
        consumes: ['application/json'],
        produces: ['application/json'],
      },
    })

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
        secret: fastify.config.SESSION_SECRET,
        cookie: {
          httpOnly: !(fastify.config.NODE_ENV === 'development'), // set httpOnly and secure off when in dev
          secure: !(fastify.config.NODE_ENV === 'development'),
          expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // session is valid for 14 days
        },
      }
    )

    // Syncronize modules_imports with db
    .register(require('./modules_sync'))

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

  pluginDirs.forEach((dir) => {
    fastify.register(fastifyAutoload, {
      dir: dir,
      options: Object.assign({
        opts,
      }),
    })
  })
  routeDirs.forEach((dir) => {
    fastify.register(fastifyAutoload, {
      dir: dir,
      options: Object.assign({
        prefix: '/api',
        opts,
      }),
    })
  })

  /**
   * Load Client
   * In Dev: Proxy server for fast page rerendering
   * In Production: Render static files from the react build folder
   */
  // if (fastify.config.NODE_ENV === 'development') {
  //   fastify.register(require('./proxy'), {
  //     upstream: 'http://localhost:3000',
  //     prefix: '/',
  //     http2: false,
  //   })
  // } else {
  // fastify.register(require('./static'), {
  //   root: path.join(__dirname, '../../client/build'),
  // })
  // }

  // Run code when ready
  fastify.ready(() => {
    // Load Documentation
    fastify.oas()
  })
}
