const bcrypt = require('bcrypt')
const crypto = require('crypto')
const fp = require('fastify-plugin')

const saltRounds = 12

const createKey = length => {
  return crypto.randomBytes(length).toString('hex')
}

const hash = key => {
  return bcrypt.hash(key, saltRounds)
}

const validate = (key, hash) => {
  return bcrypt.compare(key, hash)
}

module.exports = fp(async instance => {
  instance.decorate('crypto', {
    createKey,
    hash,
    validate
  })
})
