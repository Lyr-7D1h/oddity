import axios from 'axios'
import Cookies from 'js-cookie'

const baseUrl = '/api/'

const get = route => {
  return new Promise((resolve, reject) => {
    axios
      .get(baseUrl + route)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const post = (route, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(baseUrl + route, data)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const login = values => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}users/login`, {
        auth: {
          username: values.username,
          password: values.password
        }
      })
      .then(res => {
        if (res.status === 200) {
          Cookies.set('loggedIn', true)
          resolve(true)
        }
        resolve(false)
      })
      .catch(err => reject(err))
  })
}

const logout = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}users/logout`)
      .then(res => {
        if (res.status === 200) {
          Cookies.remove('loggedIn')
          resolve()
        } else {
          reject('Request failed: code is ' + res.status)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default {
  post,
  get,
  login,
  logout
}
