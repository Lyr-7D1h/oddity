import React from 'react'
import { Form, Icon, Input, Button, Row, Col } from 'antd'
import { Link } from 'react-router-dom'

import notificationHandler from '../helpers/notificationHandler'
import requester from '../helpers/requester'

import { updateUser } from '../redux/actions/userActions'
import getUser from '../helpers/getUser'

const RegisterForm = ({ form }) => {
  const { getFieldDecorator } = form

  const handleLogin = values => {
    requester
      .login(values)
      .then(isValid => {
        if (isValid) {
          updateUser(getUser())
          notificationHandler.success('Login Succeeded')
        } else {
          notificationHandler.error('Wrong password or username')
        }
      })
      .catch(err => {
        notificationHandler.error('Wrong password or username')
      })
  }

  const handleSubmit = e => {
    e.preventDefault()

    const username = e.target[0].value
    const password = e.target[1].value

    if (username) {
      if (password) {
        handleLogin({ username, password })
      } else {
        notificationHandler.error('Please fill in your password')
      }
    } else {
      notificationHandler.error('Please fill in your username')
    }
  }

  const compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback("Passwords don't match")
    } else {
      callback()
    }
  }

  const validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && this.state.confirmDirty) {
      form.validateFields(['password-confirm'], { force: true })
    }
    callback()
  }

  return (
    <Row type="flex">
      <Col
        span={12}
        style={{ padding: '2%', paddingLeft: '5%', paddingRight: '5%' }}
      >
        <Form
          onSubmit={handleSubmit}
          style={{ width: '100%' }}
          className="register-form"
        >
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, whitespace: false }]
            })(
              <Input
                style={{ width: '50%' }}
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="text"
                name="username"
                placeholder="Username"
              />
            )}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true }, { validator: validateToNextPassword }]
            })(
              <Input.Password
                style={{ width: '50%' }}
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                name="password"
                placeholder="Password"
                required
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password-confirm', {
              rules: [
                { required: true, message: 'Please confirm your password' },
                { validator: compareToFirstPassword }
              ]
            })(
              <Input.Password
                style={{ width: '50%' }}
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                name="password-confirm"
                placeholder="Password"
                required
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
            or <Link to="/register">register now!</Link>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default Form.create({ name: 'register' })(RegisterForm)
