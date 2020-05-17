import Cookies from 'js-cookie'

export const getUser = () => {
  const user = Cookies.get('user')
  if (user === undefined) {
    return {}
  } else {
    return JSON.parse(user)
  }
}

export const setUser = (user) => {
  Cookies.set('user', JSON.stringify(user))
}
