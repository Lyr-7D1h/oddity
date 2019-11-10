export const UPDATE_CONFIG = 'config:updateConfig'

export const updateConfig = config => {
  return {
    type: UPDATE_CONFIG,
    payload: {
      config: config
    }
  }
}
