import { notification } from 'antd'

notification.config({
  placement: 'topRight',
  top: 70,
  duration: 2
})

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
