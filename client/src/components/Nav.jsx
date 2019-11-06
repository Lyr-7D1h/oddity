import React from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'

export default ({ selected, config }) => {
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

        {/* <Menu.Item key="2">
          <Link to="/">Forum</Link>
        </Menu.Item>

        <Menu.Item key="3">
          <Link to="/">Members</Link>
        </Menu.Item>

        <Menu.Item key="4">
          <Link to="/">Servers</Link>
        </Menu.Item> */}

        <Menu.Item key="5">
          <Link to="/login">Login</Link>
        </Menu.Item>
      </Menu>
    </>
  )
}
