import React, { useState } from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Redirect } from 'react-router-dom'
import requester from '../helpers/requester'
import notificationHandler from '../helpers/notificationHandler'
import getUser from '../helpers/getUser'

export default ({ selected, config }) => {
  const [loggedIn, setLoggedIn] = useState(Cookies.get('user') !== undefined)
  const [loginError, setLoginError] = useState(false)

  const { permission } = getUser()

  // TODO: finish when configuration is done
  // get configuration
  const items = [{ name: 'Oddity', isTitle: true }]
  // if (config.nav) {
  //   items.concat(config.nav)
  // }

  const handleLogout = () => {
    requester
      .logout()
      .then(() => {
        notificationHandler.success('Logged out successfully')
        setLoggedIn(false)
      })
      .catch(() => {
        notificationHandler.error('Something went wrong')
        setLoginError(true)
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
            <Menu.Item key={i} className={item.isTitle ? 'title' : ''}>
              <Link to="/">{item.name}</Link>
            </Menu.Item>
          )
        })}
        {loggedIn ? (
          <Menu.Item style={{ float: 'right' }} key={items.length++}>
            <div onClick={handleLogout}>Logout</div>
          </Menu.Item>
        ) : (
          <Menu.Item style={{ float: 'right' }} key={items.length++}>
            <Link to="/login">Login</Link>
          </Menu.Item>
        )}
        {permission === 1 ? (
          <Menu.Item style={{ float: 'right' }}>
            <Link to="/admin">Admin</Link>
          </Menu.Item>
        ) : (
          ''
        )}
      </Menu>
    </>
  )
}
