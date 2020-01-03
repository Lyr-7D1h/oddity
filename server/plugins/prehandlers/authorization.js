const fp = require('fastify-plugin')
const auth = require('basic-auth')
const { Unauthorized, InternalServerError } = require('http-errors')

module.exports = fp(async instance => {
  instance.decorateRequest('credentials', {
    id: null,
    isPortal: false
  })

  const portalAuth = (request, reply, done) => {
    console.log('PORTAL AUTH')
    const basicCredentials = auth(request)
    if (basicCredentials && basicCredentials.name && basicCredentials.pass) {
      instance.models.portal
        .findOne({
          where: { accessKey: basicCredentials.name }
        })
        .then(portal => {
          if (portal) {
            instance.crypto
              .validate(basicCredentials.pass, portal.secretKey)
              .then(isValid => {
                if (isValid) {
                  request.credentials.id = portal.id
                  request.credentials.isPortal = true
                  done()
                }
              })
              .catch(err => {
                instance.log.error(err)
                done(new InternalServerError())
              })
          } else {
            // if none found unauthorized
            done(new Unauthorized())
          }
        })
        .catch(err => {
          instance.log.error(err)
          done(new InternalServerError())
        })
    } else {
      done(new Unauthorized())
    }
  }

  const userAuth = (request, reply, done) => {
    console.log('USER AUTH')
    // get credentials from request
    const basicCredentials = auth(request)

    if (basicCredentials && basicCredentials.name && basicCredentials.pass) {
      instance.models.user
        .findAll({
          where: {
            [instance.Sequelize.Op.or]: [
              { identifier: basicCredentials.name },
              { email: basicCredentials.name }
            ]
          }
        })
        .then(users => {
          console.log(users)
          if (users.length === 1) {
            instance.crypto
              .validate(basicCredentials.pass, users[0].password)
              .then(isValid => {
                if (isValid) {
                  request.credentials.id = users[0].id
                  done()
                } else {
                  done(new Unauthorized())
                }
              })
              .catch(err => {
                instance.log.error(err)
                done(new InternalServerError())
              })
          } else if (users.length > 1) {
            instance.log.error(
              `Multiple users found for id or email with name: ${basicCredentials.name}`
            )
            done(new Unauthorized())
          } else {
            // if none found unauthorized
            done(new Unauthorized())
          }
        })
        .catch(err => {
          instance.log.error(err)
          done(new InternalServerError())
        })
    } else {
      done(new Unauthorized())
    }
  }

  // TODO: Make more efficient and make improve permissions checking
  const cookieAuth = (request, reply, done) => {
    console.log('COOKIE AUTH')
    console.log(reply.store)

    if (request.session && request.session.user) {
      if (request.session.user.id) {
        // check if still in DB
        instance.models.user
          .findOne({ where: { id: request.session.user.id } })
          .then(user => {
            if (user) {
              const hasPermsUser = instance.permissions.validateRouteAuth(
                request.raw.url,
                user.permissions
              )
              if (hasPermsUser) {
                request.credentials.id = request.session.user.id
                done()
              } else if (user.roleId) {
                instance.models.role
                  .findOne({ where: { id: user.roleId } })
                  .then(role => {
                    if (role) {
                      const hasPermsRole = instance.permissions.validateRouteAuth(
                        request.raw.url,
                        role.permissions
                      )
                      if (hasPermsRole) {
                        request.credentials.id = request.session.user.id
                        done()
                      } else {
                        done(new Unauthorized())
                      }
                    } else {
                      done(new Unauthorized())
                    }
                  })
              } else {
                done(new Unauthorized())
              }
            } else {
              done(new Unauthorized())
            }
          })
          .catch(err => {
            instance.log.error(err)
            done(new InternalServerError())
          })
      } else {
        done(new Unauthorized())
      }
    } else {
      done(new Unauthorized())
    }
  }

  const basicAuth = {
    portal: portalAuth,
    user: userAuth
  }

  instance.decorate('verify', {
    basic: basicAuth,
    cookie: cookieAuth
  })
})
