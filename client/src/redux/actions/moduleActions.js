export const UPDATE_MODULES = 'modules:updateModules'
export const FETCH_MODULES = 'modules:fetchModules'

export const updateModules = modules => {
  return {
    type: UPDATE_MODULES,
    payload: {
      modules: modules
    }
  }
}
export const fetchModules = () => {
  return {
    type: FETCH_MODULES
  }
}
