import React from 'react'
import { Form, Icon, Input, Button, notification } from 'antd'
import requester from '../helpers/requester'
import notificationHandler from '../helpers/notificationHandler'

const AdminForm = props => {
  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        requester
          .login(values)
          .then(isValid => {
            if (isValid) {
              notificationHandler.success('Login Succeeded')
            } else {
              notificationHandler.error('Wrong password or username')
            }
          })
          .catch(err => {
            notificationHandler.error('Wrong password or username')
          })
      } else {
        notificationHandler.error('something went wrong')
      }
    })
  }

  const { getFieldDecorator } = props.form
  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please fill in your username' }]
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please fill in your password' }]
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          block
        >
          Log in
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create({ name: 'normal_login' })(AdminForm)
