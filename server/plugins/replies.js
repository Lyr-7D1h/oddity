const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  instance.decorateReply('success', function() {
    this.status(200).send({
      message: 'success'
    })
  })
  instance.decorateReply('noChange', function() {
    this.status(200).send({
      message: 'nothing changed'
    })
  })
})
