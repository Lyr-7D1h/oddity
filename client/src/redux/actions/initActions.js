export const UPDATE_CONFIG = 'init:updateConfig'
export const ENABLE_MODULE = 'init:enableModule'
export const DISABLE_MODULE = 'init:disableModule'

export const updateConfig = (config) => ({
  type: UPDATE_CONFIG,
  payload: config,
})

export const enableModule = (module) => ({
  type: ENABLE_MODULE,
  payload: module,
})
export const disableModule = (module) => ({
  type: DISABLE_MODULE,
  payload: module,
})
