import store from '../redux/store'

export default (permissionString) => {
  let { init, user } = store.getState()
  const PERMISSIONS = init.permissions

  // if (!permissions || !user) {
  //   return // wait for when state is ready
  // }

  if (!PERMISSIONS[permissionString]) {
    console.error('Wrong permission string')
    return false
  }

  const permissionToCheck = PERMISSIONS[permissionString] | PERMISSIONS['ROOT'] // overwrite for root

  return (permissionToCheck & user.permissions) > 0
}
