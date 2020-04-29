const fp = require('fastify-plugin')
const http = require('http')
const path = require('path')
const send = require('send')
const { PassThrough } = require('readable-stream')

const buildFolder = path.join(__dirname, '..', '..', 'client', 'build')
var init

/**
 * PassThrough stream for injecting into html files
 * @param {string} init initial values to inject
 */
function injectInit(init) {
  return new PassThrough({
    /**
     * TODO: improved transformation performance
     */
    transform: (data, _, done) => {
      data = data.toString()
      const offset = data.toString().indexOf('<body>') + 6
      data = data.slice(0, offset) + init + data.slice(offset)
      data = Buffer.from(data)
      done(null, data)
    },
  })
}

const buildInit = (instance) => {
  return new Promise((resolve, reject) => {
    const initObject = {
      permissions: instance.PERMISSIONS,
      captcha: instance.config.CAPTCHA_CLIENT,
    }

    const initPromises = []
    initPromises.push(
      instance.models.config.findOne({
        where: { isActive: true },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      })
    )

    initPromises.push(
      instance.models.module.findAll({
        where: { enabled: true },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      })
    )

    Promise.all(initPromises)
      .then(([config, modules]) => {
        initObject.config = config ? config.dataValues : {}
        initObject.modules = modules ? modules.map((mod) => mod.dataValues) : []
        instance.log.debug('Forwarder: updating init')
        init = `<script>window.init=${JSON.stringify(initObject)}</script>`
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const watcher = (models, instance) => {
  const errHandler = (err) => {
    instance.log.error(err)
    instance.sentry.captureException(err)
  }

  models.forEach((model) => {
    model.afterValidate(
      'afterValidate',
      () => {
        // Make sure update has gone through before updating init
        setTimeout(() => {
          return buildInit(instance).catch(errHandler)
        })
      },
      1000
    )
  })
}

module.exports = fp(
  async (instance) => {
    // Populate init
    buildInit(instance).catch((err) => {
      instance.log.error(err)
      instance.sentry.captureException(err)
    })

    // Wait for the server to load before watching changes
    setTimeout(() => {
      watcher([instance.models.module, instance.models.config], instance)
    }, 1000)

    /**
     * DEVELOPMENT
     * Forward from React Development Server
     */
    const proxyHandler = (request, reply) => {
      const path = request.params['*']

      http
        .get(
          `http://localhost:3000/${path}`,
          { headers: { Accept: '*/*' } },
          (response) => {
            const contentType = response.headers['content-type']
            const { statusCode } = response
            reply.type(contentType)

            if (
              statusCode === 200 &&
              contentType === 'text/html; charset=UTF-8' &&
              path !== 'sockjs-node'
            ) {
              reply.send(response.pipe(injectInit(init)))
            } else {
              reply.send(response)
            }
          }
        )
        .on('error', (err) => {
          instance.log.error(err)
          instance.sentry.captureException(err)
          return reply.internalServerError('Could not fetch from remove server')
        })
    }

    /**
     * PRODUCTION
     * Static File Sending
     */
    const sendFile = (request, reply, path) => {
      let stream = send(request.raw, path, {
        root: buildFolder,
        lastModified: false, // You could speculate version because of this
      })
      let resolvedFilename

      stream.on('file', function (path) {
        resolvedFilename = path
      })

      // Render index.html if directory
      stream.on('directory', () => {
        return sendFile(request, reply, '/')
      })

      stream.on('error', function (err) {
        if (err) {
          if (err.code === 'ENOENT') {
            const pathList = path.split('/')
            if (pathList[pathList.length - 1].split('.').length === 1) {
              // if not file extension display index.html with 200
              instance.log.info(`Redirecting to index.html for ${path}`)
              return sendFile(request, reply, '/')
            } else {
              // if file display index.html with 404
              reply.code(404)
              return sendFile(request, reply, '/')
            }
          } else {
            instance.log.error(err)
            instance.sentry.captureException(err)
            reply.internalServerError('Could not fetch file')
          }
        }
      })

      const response = reply.res

      let wrap
      // Inject Initial data if path is root/index.html
      if (path === '/') {
        wrap = injectInit(init, reply)
        wrap.setHeader = (name, value) => {
          // because we transformed adjust Content-Length (no response without adjustment)
          if (name === 'Content-Length') {
            response.setHeader(name, value + init.length)
          } else {
            response.setHeader(name, value)
          }
        }
      } else {
        wrap = new PassThrough({
          flush(cb) {
            this.finished = true
            if (reply.res.statusCode === 304) {
              reply.send('')
            }
            cb()
          },
        })

        wrap.setHeader = response.setHeader.bind(response)
      }

      wrap.getHeader = response.getHeader.bind(response)

      wrap.socket = request.raw.socket
      wrap.finished = false

      Object.defineProperty(wrap, 'filename', {
        get() {
          return resolvedFilename
        },
      })
      Object.defineProperty(wrap, 'statusCode', {
        get() {
          return response.statusCode
        },
        set(code) {
          response.statusCode = code
        },
      })

      // reply.send sends no reply when data has been transformed
      stream.pipe(wrap).pipe(response)
    }
    const staticHandler = (request, reply) => {
      const path = '/' + request.params['*']
      sendFile(request, reply, path)
    }

    const handler =
      instance.config.NODE_ENV === 'development' ? proxyHandler : staticHandler

    instance.all(
      '/*',
      {
        schema: { hide: true },
        permissions: instance.PERMISSIONS.NON_SET,
      },
      handler
    )
  },
  {
    name: 'forwarder',
    decorators: {
      fastify: ['models'],
    },
    dependencies: ['permission_handler'],
  }
)
