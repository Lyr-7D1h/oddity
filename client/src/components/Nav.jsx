import React, { useState } from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'

export default ({ selected, config }) => {
  const [loggedIn] = useState(Cookies.get('loggedIn') !== undefined)

  // get configuration
  const items = [{ name: 'ODDITY', title: true }]
  if (config.nav) {
    items.concat(config.nav)
  }

  return (
    <>
      <div className="logo" />
      <Menu
        mode="horizontal"
        defaultSelectedKeys={[selected]}
        style={{ lineHeight: '64px', float: 'left' }}
        theme="light"
      >
        {items.map((item, i) => {
          return (
            <Menu.Item key={i} disabled={item.title}>
              <Link to="/">{item.name}</Link>
            </Menu.Item>
          )
        })}

        {loggedIn ? (
          <Menu.Item key={items.length++}>
            <Link to="/logout">Logout</Link>
          </Menu.Item>
        ) : (
          <Menu.Item key={items.length++}>
            <Link to="/login">Login</Link>
          </Menu.Item>
        )}
      </Menu>
    </>
  )
}
