import store from '../redux/store'

export default (permissionString) => {
  const { permissions, user } = store.getState()

  if (!permissions || !user) {
    return // wait for when state is ready
  }

  if (!permissions[permissionString]) {
    console.error('Wrong permission string')
    return false
  }

  const permissionToCheck = permissions[permissionString] | permissions['ROOT'] // overwrite for root

  return (permissionToCheck & user.permissions) > 0
}
