const fp = require('fastify-plugin')
const auth = require('basic-auth')
const { Unauthorized, InternalServerError } = require('http-errors')

module.exports = fp(async instance => {
  const basicAuth = (request, reply) => {
    return new Promise((resolve, reject) => {
      // get credentials from request
      const basicCredentials = auth(request)

      if (basicCredentials && basicCredentials.name && basicCredentials.pass) {
        instance.log.info(
          `Basic Authentication attempt for "${basicCredentials.name}" ${request.raw.ip} ${request.raw.hostname}`
        )

        instance.models.user
          .findOne({
            where: {
              [instance.Sequelize.Op.or]: [
                { identifier: basicCredentials.name },
                { email: basicCredentials.name }
              ]
            }
          })
          .then(user => {
            if (user) {
              instance.crypto
                .validate(basicCredentials.pass, user.password)
                .then(isValid => {
                  if (isValid) {
                    request.user = { id: user.id }
                    resolve()
                  } else {
                    reject(new Unauthorized())
                  }
                })
                .catch(err => {
                  instance.log.error(err)
                  instance.sentry.captureException(err)
                  reject(new InternalServerError())
                })
            } else {
              // if none found unauthorized
              reject(new Unauthorized())
            }
          })
      } else {
        reject(new Unauthorized())
      }
    })
  }

  // TODO: Make more efficient and make improve permissions checking
  const cookieAuth = (request, reply) => {
    return new Promise((resolve, reject) => {
      if (request.session && request.session.user) {
        if (request.session.user.id) {
          // check if still in DB
          instance.models.user
            .findOne({
              where: { id: request.session.user.id },
              include: [{ model: instance.models.role, as: 'role' }]
            })
            .then(user => {
              if (user) {
                const hasPermsUser = instance.permissions.validateRouteAuth(
                  request.raw.url,
                  user.permissions | user.role.permissions
                )
                if (hasPermsUser) {
                  resolve()
                } else {
                  reject(new Unauthorized())
                }
              } else {
                reject(new Unauthorized())
              }
            })
            .catch(err => {
              instance.log.error(err)
              instance.sentry.captureException(err)
              reject(new InternalServerError())
            })
        } else {
          reject(new Unauthorized())
        }
      } else {
        reject(new Unauthorized())
      }
    })
  }

  instance.decorate('authentication', {
    basic: basicAuth,
    cookie: cookieAuth
  })
})
