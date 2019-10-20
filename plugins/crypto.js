const bcrypt = require('bcrypt')
const crypto = require('crypto')
const fp = require('fastify-plugin')

const saltRounds = 12

const createAccessKey = () => {
  return crypto.randomBytes(10).toString('hex')
}

const createSecretKey = () => {
  return crypto.randomBytes(15).toString('hex')
}

const encryptKey = key => {
  return bcrypt.hash(key, saltRounds)
}

const validateKey = (key, hash) => {
  return bcrypt.compare(key, hash)
}

module.exports = fp(async instance => {
  instance.decorate('crypto', {
    createAccessKey,
    createSecretKey,
    encryptKey,
    validateKey
  })
})
