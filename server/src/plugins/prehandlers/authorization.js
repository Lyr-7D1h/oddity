const fp = require('fastify-plugin')
const auth = require('basic-auth')
const { Unauthorized, InternalServerError } = require('http-errors')

module.exports = fp(async (instance) => {
  const basicAuth = (request) => {
    return new Promise((resolve, reject) => {
      // get credentials from request
      const basicCredentials = auth(request)

      if (basicCredentials && basicCredentials.name && basicCredentials.pass) {
        instance.log.info(
          `Basic Authentication attempt for "${basicCredentials.name}" ${request.raw.ip}`
        )

        instance.models.user
          .findOne({
            attributes: ['permissions', 'password', 'id', 'identifier'],
            where: {
              [instance.Sequelize.Op.or]: [
                { identifier: basicCredentials.name },
                { email: basicCredentials.name },
              ],
            },
            include: [
              { attributes: ['permissions'], model: instance.models.role },
            ],
          })
          .then((user) => {
            if (user) {
              instance.crypto
                .validate(basicCredentials.pass, user.password)
                .then((isValid) => {
                  if (isValid) {
                    const permissions = instance.permissions.calcPermission(
                      user.role.permissions,
                      user.permissions
                    )
                    const authorizedRoute = instance.permissions.authorizeRoute(
                      request.raw.url,
                      request.raw.method,
                      permissions
                    )
                    if (authorizedRoute) {
                      request.user = {
                        id: user.id,
                        identifier: user.identifier,
                        permissions,
                      }
                      resolve()
                    } else {
                      reject(new Unauthorized())
                    }
                  } else {
                    reject(new Unauthorized())
                  }
                })
                .catch((err) => {
                  instance.log.error(err)
                  instance.sentry.captureException(err)
                  reject(new InternalServerError())
                })
            } else {
              reject(new Unauthorized())
            }
          })
      } else {
        reject(new Unauthorized())
      }
    })
  }

  // TODO: Make more efficient and improve permissions checking
  // Checks if session if valid and has the required permissions
  const cookieAuth = (request) => {
    return new Promise((resolve, reject) => {
      if (request.session && request.session.user) {
        if (request.session.user.id) {
          // TODO: only get attributes needed
          instance.models.user
            .findOne({
              attributes: ['permissions', 'id', 'identifier'],
              where: { id: request.session.user.id },
              include: [
                {
                  attributes: ['permissions'],
                  model: instance.models.role,
                  as: 'role',
                },
              ],
            })
            .then((user) => {
              if (user) {
                const permissions = instance.permissions.calcPermission(
                  user.role.permissions,
                  user.permissions
                )
                const authorizedRoute = instance.permissions.authorizeRoute(
                  request.raw.url,
                  request.raw.method,
                  permissions
                )
                if (authorizedRoute) {
                  request.user = {
                    id: user.id,
                    identifier: user.identifier,
                    permissions,
                  }
                  resolve()
                } else {
                  reject(new Unauthorized())
                }
              } else {
                reject(new Unauthorized())
              }
            })
            .catch((err) => {
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

  instance.decorate('authorization', {
    basic: basicAuth,
    cookie: cookieAuth,
  })
})
