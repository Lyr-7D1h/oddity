import { UPDATE_USER } from '../actions/userActions'
import getUser from 'Helpers/getUser'

export default (state, { type, payload }) => {
  switch (type) {
    case UPDATE_USER:
      return payload.user
    default:
      return getUser() || {}
  }
}
