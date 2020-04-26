'use strict'

const path = require('path')
const url = require('url')
const statSync = require('fs').statSync
const { PassThrough } = require('readable-stream')
const glob = require('glob')

const send = require('send')

const fp = require('fastify-plugin')

async function fastifyStatic(fastify, opts, next) {
  const sendOptions = {
    root: opts.root,
    acceptRanges: opts.acceptRanges,
    cacheControl: opts.cacheControl,
    dotfiles: opts.dotfiles,
    etag: opts.etag,
    extensions: opts.extensions,
    immutable: opts.immutable,
    index: opts.index,
    lastModified: opts.lastModified,
    maxAge: opts.maxAge,
  }

  // User for DecorateReply and Serve
  function pumpSendToReply(request, reply, pathname) {
    const stream = send(request.raw, pathname, sendOptions)
    var resolvedFilename

    stream.on('file', function (file) {
      resolvedFilename = file
    })

    stream.on('error', function (err) {
      if (err) {
        if (err.code === 'ENOENT') {
          // check if file has filename extension
          const pathList = pathname.split('/')
          if (pathList[pathList.length - 1].split('.').length === 1) {
            fastify.log.info(`Redirecting to index.html for ${pathname}`)
            pumpSendToReply(request, reply, '/')
          } else {
            return reply.callNotFound()
          }
        } else {
          reply.send(err)
        }
      }
    })

    const wrap = new PassThrough({
      flush(cb) {
        this.finished = true
        if (reply.res.statusCode === 304) {
          reply.send('')
        }
        cb()
      },
    })

    wrap.getHeader = reply.getHeader.bind(reply)
    wrap.setHeader = reply.header.bind(reply)
    wrap.socket = request.raw.socket
    wrap.finished = false

    Object.defineProperty(wrap, 'filename', {
      get() {
        return resolvedFilename
      },
    })
    Object.defineProperty(wrap, 'statusCode', {
      get() {
        return reply.res.statusCode
      },
      set(code) {
        reply.code(code)
      },
    })

    wrap.on('pipe', function () {
      reply.send(wrap)
    })

    if (opts.redirect === true) {
      stream.on('directory', function (res, path) {
        const parsed = url.parse(request.raw.url)
        reply.redirect(301, parsed.pathname + '/' + (parsed.search || ''))
      })
    }

    // we cannot use pump, because send error
    // handling is not compatible
    stream.pipe(wrap)
  }

  if (opts.prefix === undefined) opts.prefix = '/'
  const prefix =
    opts.prefix[opts.prefix.length - 1] === '/'
      ? opts.prefix
      : opts.prefix + '/'

  // Set the schema hide property if defined in opts or true by default
  const routeOptions = {
    schema: {
      hide: true,
    },
    permissions: fastify.PERMISSIONS.NON_SET,
  }

  // Serve
  if (opts.serve !== false) {
    fastify.get(prefix + '*', routeOptions, function (req, reply) {
      pumpSendToReply(req, reply, '/' + req.params['*'])
    })
    // fastify.head(prefix + '*', routeOptions, function (req, reply) {
    //   reply.send()
    // })

    // return early to avoid calling next afterwards
    return
  }

  next()
}

module.exports = fp(fastifyStatic, {
  fastify: '>=2.0.0',
  name: 'fastify-static',
})
