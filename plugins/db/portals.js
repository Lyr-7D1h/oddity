const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const portalSchema = new instance.mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    url: String,
    accessKey: {
      type: String,
      required: true,
      unique: true,
      min: 8,
      max: 30
    },
    secretKey: {
      type: String,
      required: true,
      unique: true,
      min: 30,
      max: 80
    }
  })

  const Portal = instance.mongoose.connection.model('Portal', portalSchema)

  /**
   * Create Admin Portal or adjust if password from env variable changes
   */
  const secret = process.env.ADMIN_SECRET || 'exsiteisverycool'

  Portal.find({ name: 'admin' }, 'secretKey _id')
    .then(portals => {
      // create if does not exist
      if (portals.length === 0) {
        new Portal({
          name: 'admin',
          accessKey: instance.crypto.createKey(10),
          secretKey: instance.crypto.createKey(15)
        })
          .save()
          .then(() => {
            instance.log.info('Created Admin Portal')
          })
          .catch(err => {
            instance.log.error(err)
          })
      } else {
        // update if it does exist
        instance.crypto
          .validateKey(secret, portals[0].secretKey)
          .then(isValid => {
            // if pass is not secret make it secret
            if (!isValid) {
              instance.crypto.encryptKey(secret).then(hash => {
                Portal.updateOne({ _id: portals[0]._id }, { secretKey: hash })
                  .then(response => {
                    if (response.nModified !== 0) {
                      instance.log.info('Updated Admin Portal')
                    }
                  })
                  .catch(err => {
                    instance.log.error(err)
                  })
              })
            }
          })
          .catch(err => {
            instance.log.error(err)
          })
      }
    })
    .catch(err => {
      instance.log.error(err)
      process.exit(1)
    })

  Portal.find({ name: 'admin' }, 'accessKey').then(portals => {
    if (portals[0]) {
      instance.log.info(`Admin AccessKey: ${portals[0].accessKey}`)
    }
  })

  instance.decorate('Portal', Portal)
})
