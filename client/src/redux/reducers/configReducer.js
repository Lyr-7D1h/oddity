import { UPDATE_CONFIG } from '../actions/configActions'

export default (state = {}, { type, payload }) => {
  switch (type) {
    case UPDATE_CONFIG:
      return payload.config
    default:
      return state
  }
}
