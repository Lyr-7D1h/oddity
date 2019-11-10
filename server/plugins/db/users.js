const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const userSchema = new instance.mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      max: 30
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 40
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    ip: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      max: 30
    },
    roleId: {
      type: instance.mongoose.ObjectId,
      required: true
    }
  })

  const User = instance.mongoose.connection.model('User', userSchema)

  instance.Role.findOne({ name: 'admin' }, '_id').then(role => {
    if (role === null) {
      instance.log.error('Default Admin Role does not exist')
    }
    User.findOne({ username: 'admin' }).then(adminUser => {
      if (adminUser === null) {
        instance.crypto
          .encryptKey('admin')
          .then(hash => {
            User.create({
              username: 'admin',
              password: hash,
              email: 'admin@admin.com',
              ip: '0:0:0:0',
              roleId: role._id
            })
              .then(() => {
                instance.log.info('Created Default Admin User')
              })
              .catch(err => instance.log.error(err))
          })
          .catch(err => instance.log.error(err))
      }
    })
  })

  instance.decorate('User', User)
})
