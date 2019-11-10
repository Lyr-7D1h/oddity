export const UPDATE_USER = 'users:updateUser'

export const updateUser = user => {
  return {
    type: UPDATE_USER,
    payload: {
      user: user
    }
  }
}
