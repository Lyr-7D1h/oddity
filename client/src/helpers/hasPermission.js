import store from '../redux/store'

/// checks if user is allowed to do something
export default (permissionStrings, user) => {
  const state = store.getState()
  const init = state.init

  if (!user) {
    console.warn('Permission checking will not be updated on user changes')
    user = state.user
  }

  const PERMISSIONS = init.permissions

  if (!Array.isArray(permissionStrings)) permissionStrings = [permissionStrings]

  let permissionToCheck = PERMISSIONS['ROOT'] // overwrite for root

  permissionStrings.forEach((permissionString) => {
    if (!PERMISSIONS[permissionString]) {
      console.error('Wrong permission string')
      return
    }

    permissionToCheck = PERMISSIONS[permissionString] | permissionToCheck
  })

  return (permissionToCheck & user.permissions) > 0
}
