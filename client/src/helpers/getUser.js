import Cookies from 'js-cookie'

export default () => {
  const user = Cookies.get('user')
  if (user === undefined) {
    return {}
  } else {
    return JSON.parse(user)
  }
}
