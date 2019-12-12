const fs = require('fs')
const pump = require('pump')

const ResourceDir = __dirname + '/../../../resources/'

module.exports = async fastify => {
  fastify.post(
    '/resources/users/:id',
    {
      schema: {
        params: 'id#'
      },
      preHandlers: [fastify.validation.Id]
    },
    (request, reply) => {
      fastify.User.findById(request.params.id)
        .then(user => {
          if (!user) {
            return reply.notFound('User not found')
          }

          const handler = (field, file, filename, encoding, mimetype) => {
            if (
              mimetype != 'image/png' &&
              mimetype != 'image/jpg' &&
              mimetype != 'image/jpeg'
            ) {
              return reply.badRequest('Invalid file type')
            } else {
              file.on('limit', () => {
                return reply.badRequest('Resource is too big')
              })
              pump(
                file,
                fs.createWriteStream(ResourceDir + `users/${request.params.id}`)
              )
            }
          }

          const done = err => {
            if (!reply.sent) {
              if (err) {
                fastify.log.error(err)
                return reply.internalServerError()
              }
              const avatar = '/resources/users/' + request.params.id
              user.avatar = avatar
              user
                .save()
                .then(() => {
                  return reply.send({
                    url: avatar
                  })
                })
                .catch(err => {
                  fastify.log.error(err)
                  return reply.internalServerError()
                })
            }
          }

          const mp = request.multipart(handler, done)

          mp.on('partsLimit', () => {
            return reply.badRequest('Maximum number of form parts reached')
          })

          mp.on('filesLimit', () => {
            return reply.badRequest('Maximum number of files reached')
          })

          mp.on('fieldsLimit', () => {
            return reply.badRequest('Maximim number of fields reached')
          })
        })
        .catch(err => {
          fastify.log.error(err)
          reply.internalServerError()
        })
    }
  )
}
