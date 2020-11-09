export const UPDATE_CONFIG = 'init:updateConfig'
export const UPDATE_MODULE_ROUTE = 'init:updateModule'
export const ENABLE_MODULE = 'init:enableModule'
export const DISABLE_MODULE = 'init:disableModule'

export const updateConfig = (config) => ({
  type: UPDATE_CONFIG,
  payload: config,
})

export const updateModuleRoute = (id, route) => ({
  type: UPDATE_MODULE_ROUTE,
  payload: { id, route },
})

/// Add module if it does not already exist
export const enableModule = (module) => ({
  type: ENABLE_MODULE,
  payload: module,
})

/// Remove module if it exists
export const disableModule = (module) => ({
  type: DISABLE_MODULE,
  payload: module,
})
