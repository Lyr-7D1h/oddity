import React, { useState } from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import requester from '../helpers/requester'
import notificationHandler from '../helpers/notificationHandler'

export default ({ selected, config }) => {
  const [loggedIn, setLoggedIn] = useState(
    Cookies.get('loggedIn') !== undefined
  )

  // TODO: finish when configuration is done
  // get configuration
  const items = [{ name: 'Oddity', isTitle: true }]
  if (config.nav) {
    items.concat(config.nav)
  }

  const handleLogout = () => {
    requester
      .logout()
      .then(() => {
        notificationHandler.success('Logged out successfully')
        setLoggedIn(false)
      })
      .catch(() => {
        notificationHandler.error('Logout failed')
      })
  }

  return (
    <>
      <div className="logo" />
      <Menu
        mode="horizontal"
        defaultSelectedKeys={[selected]}
        style={{ lineHeight: '64px' }}
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
          <Menu.Item
            style={{ float: 'right', marginRight: '20px' }}
            key={items.length++}
          >
            <div onClick={handleLogout}>Logout</div>
          </Menu.Item>
        ) : (
          <Menu.Item
            style={{ float: 'right', marginRight: '20px' }}
            key={items.length++}
          >
            <Link to="/login">Login</Link>
          </Menu.Item>
        )}
      </Menu>
    </>
  )
}
