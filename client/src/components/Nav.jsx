import React, { useState } from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import requester from '../helpers/requester'
import notificationHandler from '../helpers/notificationHandler'

import { connect } from 'react-redux'
import { updateUser } from '../redux/actions/userActions'

const Nav = ({ selected, config, user, updateUser }) => {
  const [loginError, setLoginError] = useState(false)

  const items = config.nav || []

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
      <div className="logo" />
      <Menu
        mode="horizontal"
        defaultSelectedKeys={[selected]}
        style={{ lineHeight: '64px', marginRight: '20px' }}
        theme="light"
      >
        {items.map((item, i) => {
          return (
            <Menu.Item
              key={item.name.toLowerCase()}
              className={item.isTitle ? 'title' : ''}
            >
              <Link to="/">{item.name}</Link>
            </Menu.Item>
          )
        })}
        {user.username !== undefined ? (
          <Menu.Item style={{ float: 'right' }} key="logout">
            <div onClick={handleLogout}>Logout</div>
          </Menu.Item>
        ) : (
          <Menu.Item style={{ float: 'right' }} key="login">
            <Link to="/login">Login</Link>
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
    </>
  )
}

export default connect(
  state => ({ user: state.user, config: state.config }),
  { updateUser }
)(Nav)
