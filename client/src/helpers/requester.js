import axios from 'axios'
import Cookies from 'js-cookie'

const baseUrl = '/api/'

const requester = {}

requester.get = route => {
  return new Promise((resolve, reject) => {
    axios
      .get(baseUrl + route)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          err.message = err.response.data.message
        }
        reject(err)
      })
  })
}

requester.post = (route, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(baseUrl + route, data)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          err.message = err.response.data.message
        }
        reject(err)
      })
  })
}

requester.delete = route => {
  return new Promise((resolve, reject) => {
    axios
      .delete(baseUrl + route)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          err.message = err.response.data.message
        }
        reject(err)
      })
  })
}

requester.patch = (route, data) => {
  return new Promise((resolve, reject) => {
    axios
      .patch(baseUrl + route, data)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          err.message = err.response.data.message
        }
        reject(err)
      })
  })
}

requester.put = (route, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(baseUrl + route, data)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          err.message = err.response.data.message
        }
        reject(err)
      })
  })
}

requester.login = values => {
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

requester.logout = () => {
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

export default requester
