export const UPDATE_MODULES = 'config:updateModules'
export const FETCH_MODULES = 'config:fetchModules'

export const updateModules = modules => {
  return {
    type: UPDATE_MODULES,
    payload: {
      config: modules
    }
  }
}
export const fetchModules = () => {
  return {
    type: FETCH_MODULES
  }
}
