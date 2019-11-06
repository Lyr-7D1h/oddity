import { notification } from 'antd'

const error = (message, description) => {
  notification['error']({
    message: message,
    description: description
  })
}

const success = (message, description) => {
  notification['success']({
    message: message,
    description: description
  })
}

export default { error, success }
