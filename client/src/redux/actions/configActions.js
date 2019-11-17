export const UPDATE_CONFIG = 'config:updateConfig'
export const FETCH_CONFIG = 'config:fetchConfig'

export const updateConfig = config => {
  return {
    type: UPDATE_CONFIG,
    payload: {
      config: config
    }
  }
}
export const fetchConfig = () => {
  return {
    type: FETCH_CONFIG
  }
}
