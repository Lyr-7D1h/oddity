const fp = require('fastify-plugin')
const sanitizeHtml = require('sanitize-html')

module.exports = fp(async (instance) => {
  instance.decorate('htmlSanitizer', (html) => {
    return sanitizeHtml(html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2']),
    })
  })
})
