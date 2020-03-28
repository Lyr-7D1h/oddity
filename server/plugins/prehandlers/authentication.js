const fp = require('fastify-plugin')
const auth = require('basic-auth')
const { Unauthorized, InternalServerError } = require('http-errors')

module.exports = fp(async instance => {
  const basicAuth = (request, reply, done) => {
    // get credentials from request
    const basicCredentials = auth(request)

    if (basicCredentials && basicCredentials.name && basicCredentials.pass) {
      instance.log.info(
        `Basic Authentication attempt for "${basicCredentials.name}"`
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
                  reply.user = { id: user.id }
                  done()
                } else {
                  done(new Unauthorized())
                }
              })
              .catch(err => {
                instance.log.error(err)
                instance.sentry.captureException(err)
                done(new InternalServerError())
              })
          } else {
            // if none found unauthorized
            done(new Unauthorized())
          }
        })
    } else {
      done(new Unauthorized())
    }
  }

  // TODO: Make more efficient and make improve permissions checking
  const cookieAuth = (request, reply, done) => {
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
                done()
              } else {
                done(new Unauthorized())
              }
            } else {
              done(new Unauthorized())
            }
          })
          .catch(err => {
            instance.log.error(err)
            instance.sentry.captureException(err)
            done(new InternalServerError())
          })
      } else {
        done(new Unauthorized())
      }
    } else {
      done(new Unauthorized())
    }
  }

  instance.decorate('authentication', {
    basic: basicAuth,
    cookie: cookieAuth
  })
})
