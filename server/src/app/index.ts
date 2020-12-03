'use strict'

import { FastifyPluginCallback } from 'fastify'
import fastifyAuth from 'fastify-auth'
import fastifyAutoload from 'fastify-autoload'
import fastifyCookie from 'fastify-cookie'
import fastifyCors from 'fastify-cors'
import fastifyMultipart from 'fastify-multipart'
import fastifyOAS from 'fastify-oas'
import fastifySensible from 'fastify-sensible'
import path from 'path'
import { pluginDirs, routeDirs } from '../../module_loader_imports'

const app: FastifyPluginCallback = (fastify, opts, done) => {
  fastify
    .register(fastifyOAS, {
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

    .register(fastifySensible)

    .register(fastifyCookie)

    // Used for resources
    .register(fastifyMultipart, {
      limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 1000000, // Max field value (1MB)
        fields: 10, // Max number of non-file fields
        fileSize: 1000000, // For multipart forms (1MB)
        files: 1, // Max number of file fields (1 file at the time)
        headerPairs: 100, // Max number of header key=>value pairs
      },
    })

    .register(fastifyCors, {
      origin: 'http://localhost:3000',
    })

    .register(fastifyAuth)

    // Autoload Plugins
    .register(fastifyAutoload, {
      dir: path.join(__dirname, '../plugins'),
      options: Object.assign({}, opts),
    })

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

  // Load Documentation when ready
  fastify.ready(() => {
    fastify.oas()
  })

  done()
}

export default app
