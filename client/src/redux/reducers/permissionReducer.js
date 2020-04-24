import {
  UPDATE_PERMISSIONS,
  FETCH_PERMISSIONS,
} from '../actions/permissionsActions'

export default (state = {}, { type, payload }) => {
  switch (type) {
    case UPDATE_PERMISSIONS:
      return payload.permissions
    case FETCH_PERMISSIONS:
      return { isLoading: true }
    default:
      return state
  }
}
