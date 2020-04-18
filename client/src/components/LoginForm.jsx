import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import '@ant-design/compatible/assets/index.css'
import { Input, Button, Form } from 'antd'
import { Link } from 'react-router-dom'

import notificationHandler from '../helpers/notificationHandler'
import requester from '../helpers/requester'

import { connect } from 'react-redux'
import { updateUser } from '../redux/actions/userActions'
import getUser from '../helpers/getUser'

const LoginForm = ({ updateUser, ...props }) => {
  const handleLogin = (values) => {
    requester
      .login(values)
      .then((isValid) => {
        if (isValid) {
          updateUser(getUser())
          notificationHandler.success('Login Succeeded')
        } else {
          notificationHandler.error('Wrong password or username')
        }
      })
      .catch((err) => {
        notificationHandler.error('Wrong password or username')
      })
  }

  const handleSubmit = (values) => {
    const { username, password } = values
    handleLogin({ username, password })
  }

  return (
    <Form onFinish={handleSubmit} className="login-form">
      <Form.Item name="username" rules={[{ required: true }]}>
        <Input
          prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="text"
          placeholder="ID or Email"
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="Password"
        />
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
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}
const mapActionsToProps = {
  updateUser,
}

export default connect(mapStateToProps, mapActionsToProps)(LoginForm)
