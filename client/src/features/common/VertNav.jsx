import React from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

export default withRouter(({ items, location }) => {
  const selected = items.findIndex((item) => item.route === location.pathname)
  return (
    <Menu
      className="oddity-nav"
      defaultSelectedKeys={['' + selected]}
      defaultOpenKeys={['sub1']}
      mode="inline"
      selectable={false} // Needed for save
    >
      {items.map((item, i) => (
        <Menu.Item icon={item.icon} key={'' + i}>
          <Link to={item.route}>{item.title}</Link>
        </Menu.Item>
      ))}
    </Menu>
  )
})
