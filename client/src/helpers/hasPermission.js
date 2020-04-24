import store from '../redux/store'

export default (permissionString) => {
  let { permissions, user } = store.getState()

  const validate = () => {
    console.log(permissions, user.permissions)
    if (!permissions || !user) {
      return // wait for when state is ready
    }

    if (!permissions[permissionString]) {
      console.error('Wrong permission string')
      return false
    }

    const permissionToCheck =
      permissions[permissionString] | permissions['ROOT'] // overwrite for root

    return (permissionToCheck & user.permissions) > 0
  }

  if (permissions.isLoading) {
    store.subscribe(() => {
      permissions = store.getState().permissions
      if (!permissions.isLoading) {
        return validate()
      }
    })
  } else {
    return validate()
  }
}
