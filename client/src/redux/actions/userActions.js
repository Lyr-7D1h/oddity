import { setUser } from 'Helpers/userCookie'

export const UPDATE_USER = 'users:updateUser'

export const updateUser = (user) => {
  setUser(user) // Update user cookie
  return {
    type: UPDATE_USER,
    payload: {
      user: user,
    },
  }
}
