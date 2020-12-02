const fp = require('fastify-plugin')
const https = require('https')

module.exports = fp(async (instance) => {
  instance.decorate('captcha', (captcha, ip) => {
    return new Promise((resolve, reject) => {
      const request = https.request(
        {
          host: 'www.google.com',
          path: `/recaptcha/api/siteverify?secret=${instance.config.CAPTCHA_SERVER}&response=${captcha}&remoteip=${ip}`,
          method: 'POST',
        },
        (res) => {
          res.on('data', (data) => {
            try {
              data = JSON.parse(data.toString())
            } catch (err) {
              reject(err)
            }
            if (data && data.success) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        }
      )
      request.on('error', (err) => {
        reject(err)
      })
      request.end()
    })
  })
})
