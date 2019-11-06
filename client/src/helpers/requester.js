import axios from 'axios'

const baseUrl = '/api/'

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
          resolve(true)
        }
        resolve(false)
      })
      .catch(err => reject(err))
  })
}

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

export default {
  post,
  get,
  login
}
