const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  instance.decorate('validateIdentifier', identifier => {
    if (identifier.length < 30 && identifier.length >= 3) {
      if (identifier.match(/(^[a-z])\w+$/g)) {
        return true
      }
    }

    return false
  })
})
