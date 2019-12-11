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
      instance.Portal.find(
        { accessKey: basicCredentials.name },
        'secretKey _id'
      )
        .then(portals => {
          if (portals.length > 0) {
            instance.crypto
              .validate(basicCredentials.pass, portals[0].secretKey)
              .then(isValid => {
                if (isValid) {
                  request.credentials.id = portals[0]._id
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
      instance.User.find({ identifier: basicCredentials.name }, 'password _id')
        .then(users => {
          if (users.length > 0) {
            instance.crypto
              .validate(basicCredentials.pass, users[0].password)
              .then(isValid => {
                if (isValid) {
                  request.credentials.id = users[0]._id
                  done()
                } else {
                  done(new Unauthorized())
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

  // USER ONLY
  const cookieAuth = (request, reply, done) => {
    console.log('COOKIE AUTH')

    if (request.session && request.session.user) {
      if (request.session.user.id) {
        // check if still in DB
        instance.User.findById(
          request.session.user.id,
          '_id permissions roleId'
        )
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
                instance.Role.findById(user.roleId, 'permissions').then(
                  role => {
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
                  }
                )
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
