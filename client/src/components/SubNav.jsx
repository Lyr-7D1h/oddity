import React from 'react'
import { Menu, Row, Col } from 'antd'

export default ({ items }) => {
  return (
    <Row>
      <Menu theme="light" mode="horizontal" style={{ margin: 0 }}>
        {items.map((item, i) => (
          <Menu.Item key={i} style={{ width: 100 / items.length + '%' }}>
            <Col>{item}</Col>
          </Menu.Item>
        ))}
      </Menu>
    </Row>
  )
}
