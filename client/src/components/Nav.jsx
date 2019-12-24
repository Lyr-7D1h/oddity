import React, { useState } from 'react'
import { Menu, Row, Col, Typography } from 'antd'

import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import requester from '../helpers/requester'
import notificationHandler from '../helpers/notificationHandler'

import { connect } from 'react-redux'
import { updateUser } from '../redux/actions/userActions'

const Nav = ({ selected, config, user, updateUser }) => {
  let { routes, title } = config
  const [loginError, setLoginError] = useState(false)

  // make sure default route / home route is not included
  routes = routes.filter(route => !route.default)

  selected = selected[0]

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
      <Row className="oddity-nav">
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
            className="oddity-nav"
          >
            {routes.map((mod, i) => (
              <Menu.Item key={mod.path}>
                <Link to={`/${mod.path}`}>{mod.name}</Link>
              </Menu.Item>
            ))}

            {user.username === undefined && (
              <Menu.Item style={{ float: 'right' }} key="login">
                <Link to="/login">Login</Link>
              </Menu.Item>
            )}
            {user.username === undefined && (
              <Menu.Item style={{ float: 'right' }} key="register">
                <Link to="/register">Register</Link>
              </Menu.Item>
            )}

            {user.username && user.identifier !== 'admin' && (
              <Menu.SubMenu style={{ float: 'right' }} title={user.username}>
                <Menu.ItemGroup title="Profile">
                  <Menu.Item key="account">
                    <Link to="/account">Account</Link>
                  </Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup title="Actions">
                  <Menu.Item key="logout">
                    <Typography.Text type="danger" onClick={handleLogout}>
                      Logout
                    </Typography.Text>
                  </Menu.Item>
                </Menu.ItemGroup>
              </Menu.SubMenu>
            )}

            {user.identifier === 'admin' && (
              <Menu.Item style={{ float: 'right' }} key="logout">
                <Typography.Text type="danger" onClick={handleLogout}>
                  Logout
                </Typography.Text>
              </Menu.Item>
            )}
            {user.permissions === 1 && (
              <Menu.Item style={{ float: 'right' }} key="admin">
                <Link to="/admin">Admin</Link>
              </Menu.Item>
            )}
          </Menu>
        </Col>
      </Row>
    </>
  )
}

export default connect(
  state => {
    return {
      user: state.user,
      config: state.config,
      selected: state.page.selected
    }
  },
  {
    updateUser
  }
)(Nav)
