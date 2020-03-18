import React from 'react'
import { Menu, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

export default withRouter(({ items, location }) => {
  const path = location.pathname.split('/')
  path.shift()
  const selectedPath = items.find(item => item.toLowerCase() === path[1])
  const selected = selectedPath ? `${path[0]}_` + selectedPath.toLowerCase() : 0

  return (
    <Row>
      <Menu
        defaultSelectedKeys={[selected]}
        theme="light"
        mode="horizontal"
        style={{ margin: 0, width: '100%' }}
      >
        {items.map((item, i) => (
          <Menu.Item
            key={`${path[0]}_${item.toLowerCase()}`}
            style={{ width: 100 / items.length + '%' }}
          >
            <Link to={`/${path[0]}/${item.toLowerCase()}`}>
              <Col style={{ textAlign: 'center' }}>{item}</Col>
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    </Row>
  )
})
