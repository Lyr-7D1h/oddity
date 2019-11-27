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

const put = (route, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(baseUrl + route, data)
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
      .get(`${baseUrl}auth/login`, {
        auth: {
          username: values.username,
          password: values.password
        }
      })
      .then(res => {
        if (res.status === 200) {
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
      .get(`${baseUrl}auth/logout`)
      .then(res => {
        if (res.status === 200) {
          resolve()
        } else {
          reject('Request failed: code is ' + res.status)
        }
      })
      .catch(err => {
        // also remove when current session is invalid
        if (err.response.status === 401) {
          Cookies.remove('user')
        }
        reject(err)
      })
  })
}

export default {
  post,
  put,
  get,
  login,
  logout
}
