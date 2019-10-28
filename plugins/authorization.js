const fp = require('fastify-plugin')
const auth = require('basic-auth')
const { Unauthorized, InternalServerError } = require('http-errors')

const portalAuth = (request, reply, next) => {
  const user = auth(request)
  if (user && user.name && user.pass) {
    instance.Portal.find({ accessKey: user.name }, 'secretKey')
      .then(portals => {
        if (portals.length > 0) {
          instance.crypto
            .validateKey(user.pass, portals[0].secretKey)
            .then(isValid => {
              if (isValid) {
                return next()
              }
            })
            .catch(err => {
              instance.log.error(err)
              return reply.send(new InternalServerError())
            })
        }
      })
      .catch(err => {
        instance.log.error(err)
      })
  } else {
    reply.send(new Unauthorized())
  }
}

const userAuth = (request, reply, next) => {
  const user = auth(request)
  if (user && user.name && user.pass) {
    instance.Portal.find({ accessKey: user.name }, 'secretKey')
      .then(portals => {
        if (portals.length > 0) {
          instance.crypto
            .validateKey(user.pass, portals[0].secretKey)
            .then(isValid => {
              if (isValid) {
                return next()
              }
            })
            .catch(err => {
              instance.log.error(err)
              return reply.send(new InternalServerError())
            })
        }
      })
      .catch(err => {
        instance.log.error(err)
      })
  } else {
    reply.send(new Unauthorized())
  }
}

const cookieAuth = (request, reply, done) => {
  if (request.session) {

  } else {
    done(new Unauthorized())
  }
}

const basicAuth = {
  portal: portalAuth,
  user: userAuth
}

module.exports = fp(async instance => {
  instance.decorate("verify", {
    basic: basicAuth,
    cookie: cookieAuth
  })
})
