const fp = require('fastify-plugin')

const PERMISSIONS = {
  NONE: 0x1,
  ADMIN: 0x2,
  MANAGE_ROLES: 0x4,
  MANAGE_MODULES: 0x8
}

// Add Permission to schema summary of route
const addPermissionToDocumentation = (routeOptions, permission) => {
  const permissionStrings = Object.keys(PERMISSIONS).filter(
    key => PERMISSIONS[key] & permission
  )
  if (permissionStrings.length === 0) {
    permissionStrings.push('NONE')
  }

  let permissionMessage = `[${permissionStrings.join(' | ')}]`

  routeOptions.schema = routeOptions.schema ? routeOptions.schema : {}

  routeOptions.schema.summary = routeOptions.schema.summary
    ? routeOptions.schema.summary + ' ' + permissionMessage
    : permissionMessage

  permissionMessage = `You need one of these permissions:\n${permissionStrings.join(
    ', '
  )}`
  routeOptions.schema.description = routeOptions.schema.description
    ? routeOptions.schema.descripton + `\n` + permissionMessage
    : permissionMessage
}

const getPermission = permissions => {
  if (Array.isArray(permissions)) {
    let permission = 0
    permissions.forEach(perm => (permission += perm))
    return permission
  } else if (permissions !== null || permissions !== undefined) {
    return permissions
  } else {
    return undefined
  }
}

module.exports = fp(async instance => {
  /**
   * Check permissions for each route
   */
  const routes = {}
  instance.addHook('onRoute', opts => {
    const permission = getPermission(opts.permissions)
    const methods = Array.isArray(opts.method) ? opts.method : [opts.method]
    if (permission !== undefined) {
      addPermissionToDocumentation(opts, permission)
      methods.forEach(method => {
        routes[method + ':' + opts.path] = permission
      })
    } else {
      instance.log.warn(
        `No permissions set for route: ${methods.join(', ')}: ${opts.path}`
      )
    }
  })

  const authorizeRoute = (url, method, permission) => {
    // get permissions for the base route (/forum/test would be forum)
    const routePermission = routes[`${method}:${url}`]

    if (routePermission === null || routePermission === undefined) {
      return false
    }

    // check permission with an bitwise AND operation
    if (permission & routePermission) {
      return true
    }

    return false
  }

  const calcPermission = (...perms) => {
    let result = 0
    for (let i in perms) {
      result = result | perms[i]
    }
    return result
  }

  instance.decorate('PERMISSIONS', PERMISSIONS)
  instance.decorate('permissions', {
    calcPermission,
    authorizeRoute
  })
})
