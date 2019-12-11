import React from 'react'
import { Form, Icon, Input, Button } from 'antd'
import { Link } from 'react-router-dom'

import notificationHandler from '../helpers/notificationHandler'
import requester from '../helpers/requester'

import { connect } from 'react-redux'
import { updateUser } from '../redux/actions/userActions'
import getUser from '../helpers/getUser'

const LoginForm = ({ updateUser, ...props }) => {
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

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        <Input
          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="text"
          name="user"
          placeholder="ID or Email"
          required
        />
      </Form.Item>
      <Form.Item>
        <Input.Password
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
          name="password"
          placeholder="Password"
          required
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

const mapStateToProps = state => {
  return {
    user: state.user
  }
}
const mapActionsToProps = {
  updateUser
}

export default connect(mapStateToProps, mapActionsToProps)(LoginForm)
