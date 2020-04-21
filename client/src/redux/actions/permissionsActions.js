export const UPDATE_PERMISSIONS = 'permissions:updatePermissions'
export const FETCH_PERMISSIONS = 'permissions:fetchPermissions'

export const updatePermissions = (permissions) => {
  return {
    type: UPDATE_PERMISSIONS,
    payload: {
      permissions: permissions,
    },
  }
}
export const fetchPermissions = () => {
  return {
    type: FETCH_PERMISSIONS,
  }
}
