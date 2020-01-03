'use strict'

const path = require('path')
const fastifyAutoload = require('fastify-autoload')

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
          version: '0.1.0'
        },
        externalDocs: {
          url: 'https://oddityservers.com/developer',
          description: 'Find more info here'
        },
        servers: [
          {
            url:
              fastify.config.NODE_ENV === 'development'
                ? 'http://localhost:5000'
                : '/'
          }
        ],
        consumes: ['application/json'],
        produces: ['application/json']
      }
    })

    .register(require('fastify-sensible'))

    .register(require('fastify-cookie'))
    .register(require('fastify-session'), {
      secret: fastify.config.SESSION_SECRET,
      cookie: {
        httpOnly: !(fastify.config.NODE_ENV === 'development'), // set httpOnly and secure off when in dev
        secure: !(fastify.config.NODE_ENV === 'development')
      }
    })

    .register(require('fastify-multipart'), {
      limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 1000000, // Max field value size in bytes
        fields: 10, // Max number of non-file fields
        fileSize: 1000000, // For multipart forms, the max file size
        files: 1, // Max number of file fields
        headerPairs: 2000 // Max number of header key=>value pairs
      }
    })

    .register(require('fastify-cors'), {
      origin: 'http://localhost:3000'
    })

    .register(require('fastify-auth'))

    // Autoload Plugins
    .register(fastifyAutoload, {
      dir: path.join(__dirname, '../plugins'),
      options: Object.assign({}, opts)
    })

    // Autoload database
    .register(require('../db'))

    // Autoload Routes
    .register(fastifyAutoload, {
      dir: path.join(__dirname, '../routes'),
      options: Object.assign(
        {
          prefix: '/api'
        },
        opts
      )
    })

    .register(require('fastify-static'), {
      prefix: '/resources',
      decorateReply: false,
      root: path.join(__dirname, '../../resources')
    })

  // Load default config if not a test
  if (fastify.config.NODE_ENV !== 'testing') {
    fastify.register(require('./default_config'))
  }

  if (fastify.config.NODE_ENV === 'development') {
    // if development proxy requests to dev react server
    fastify.register(require('./proxy'), {
      upstream: 'http://localhost:3000',
      prefix: '/',
      http2: false
    })
  } else {
    // use react build
    fastify.register(require('./static'), {
      root: path.join(__dirname, '../../client/build')
    })
  }

  // Load documentation
  fastify.ready(() => fastify.oas())
}
