const fp = require('fastify-plugin')

module.exports = fp((instance, _, done) => {
  instance.decorate('setUserCookie', function (reply, id) {
    return new Promise((resolve, reject) => {
      instance.models.user
        .findOne({
          where: { id: id },
          include: [
            {
              model: instance.models.role,
            },
          ],
        })
        .then((user) => {
          const userCookie = {
            id: user.id,
            username: user.username,
            identifier: user.identifier,
            avatar: user.avatar,
            email: user.email,
            hasFinishedAccount: user.hasFinishedAccount,
          }

          userCookie.permissions = user.role.permissions | user.permissions

          reply.setCookie('user', JSON.stringify(userCookie), {
            httpOnly: false, // Should always be false because js needs to interact with this
            secure: !(instance.config.NODE_ENV === 'development'),
            path: '/',
          })
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  })
  done()
})
