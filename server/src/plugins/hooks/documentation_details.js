const fastifyPlugin = require('fastify-plugin')

const getLastPathWord = url => {
  const routeParts = url.split('/').filter(part => part !== '')
  let lastPath = routeParts[routeParts.length - 1]

  if (lastPath.startsWith(':')) {
    return getLastPathWord(url.replace(lastPath, ''))
  } else {
    return lastPath ? lastPath : ''
  }
}

const addTitle = route => {
  if (!route.schema.summary) {
    const lastPath = getLastPathWord(route.url)
    route.schema.summary = `${lastPath.charAt(0).toUpperCase()}${lastPath.slice(
      1
    )}`
  }
}

/**
 * TODO: add authentication method
 */
module.exports = fastifyPlugin(async instance => {
  instance.addHook('onRoute', route => {
    if (route.schema) {
      addTitle(route)
    } else {
      route.schema = {}
      addTitle(route)
    }
  })
})
