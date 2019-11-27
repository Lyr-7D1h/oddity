import React, { useState } from 'react'
import { Menu, Row, Col } from 'antd'

import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import requester from '../helpers/requester'
import notificationHandler from '../helpers/notificationHandler'

import { connect } from 'react-redux'
import { updateUser } from '../redux/actions/userActions'

const Nav = ({ selected, modules, title, user, updateUser }) => {
  const [loginError, setLoginError] = useState(false)

  const handleLogout = () => {
    requester
      .logout()
      .then(() => {
        updateUser({})
        notificationHandler.success('Logged out successfully')
      })
      .catch(() => {
        setLoginError(true) // redirect to /login when something went wrong
        updateUser({}) // remove user from state
        notificationHandler.error('Something went wrong')
      })
  }

  return (
    <>
      {loginError ? <Redirect to="/login" /> : ''}
      <Row>
        <Col span={4}>
          <div className="title">
            <Link to="/">{title}</Link>
          </div>
        </Col>
        <Col span={20}>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={[selected]}
            style={{ lineHeight: '64px', marginRight: '20px' }}
            theme="light"
          >
            {modules.map((mod, i) => (
              <Menu.Item key={mod.route}>
                <Link to={`/${mod.route}`}>{mod.name}</Link>
              </Menu.Item>
            ))}

            {user.username !== undefined || (
              <Menu.Item style={{ float: 'right' }} key="login">
                <Link to="/login">Login</Link>
              </Menu.Item>
            )}
            {user.username !== undefined || (
              <Menu.Item style={{ float: 'right' }} key="register">
                <Link to="/register">Register</Link>
              </Menu.Item>
            )}

            {user.username === undefined || (
              <Menu.Item style={{ float: 'right' }} key="logout">
                <div onClick={handleLogout}>Logout</div>
              </Menu.Item>
            )}

            {user.permissions === 1 ? (
              <Menu.Item style={{ float: 'right' }} key="admin">
                <Link to="/admin">Admin</Link>
              </Menu.Item>
            ) : (
              ''
            )}
          </Menu>
        </Col>
      </Row>
    </>
  )
}

export default connect(
  state => ({
    user: state.user,
    title: state.config.title,
    modules: state.config.modules
  }),
  {
    updateUser
  }
)(Nav)
