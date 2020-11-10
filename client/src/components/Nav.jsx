import React, { useState } from 'react'
import { Menu, Row, Col, Typography } from 'antd'

import { withRouter } from 'react-router'

import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import requester from '../helpers/requester'
import notificationHandler from '../helpers/notificationHandler'

import { connect } from 'react-redux'
import { updateUser } from '../redux/actions/userActions'
import { rootReset } from '../redux/actions/rootActions'
import hasPermission from 'Helpers/hasPermission'

const Nav = ({ modules, title, user, updateUser, location, rootReset }) => {
  const [loginError, setLoginError] = useState(false)

  const selected = location.pathname.split('/')[1]

  const handleLogout = () => {
    requester
      .logout()
      .then(() => {
        updateUser({})
        rootReset()
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
            style={{ lineHeight: '64px', marginRight: '20px', border: 'none' }}
            className="oddity-nav"
            selectable={false} // Needed for save
          >
            {modules
              .filter((mod) => mod.route !== '')
              .map((mod, i) => (
                <Menu.Item key={mod.route}>
                  <Link to={`/${mod.route}`}>{mod.title}</Link>
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

            {user.username && (user.permissions & 0x2) === 0 && (
              <Menu.SubMenu style={{ float: 'right' }} title={user.username}>
                <Menu.ItemGroup
                  title={
                    <>
                      Signed in as <b>{user.username}</b>
                    </>
                  }
                >
                  <Menu.Item key="profile">
                    <Link to={`/u/${user.identifier}`}>Profile</Link>
                  </Menu.Item>
                  <Menu.Item key="settings">
                    <Link to="/settings">Settings</Link>
                  </Menu.Item>
                  <Menu.Item key="logout" onClick={handleLogout}>
                    <Typography.Text type="danger">Logout</Typography.Text>
                  </Menu.Item>
                </Menu.ItemGroup>
              </Menu.SubMenu>
            )}

            {hasPermission('ADMIN', user) && (
              <Menu.Item
                style={{ float: 'right' }}
                onClick={handleLogout}
                key="logout"
              >
                <Typography.Text type="danger">Logout</Typography.Text>
              </Menu.Item>
            )}
            {hasPermission('ADMIN', user) && (
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
  (state) => {
    return {
      user: state.user,
      modules: state.init.modules,
      title: state.init.config.title,
    }
  },
  {
    updateUser,
    rootReset,
  }
)(withRouter(Nav))
