import React from 'react'
import { Menu, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

export default connect(state => ({ path: state.page.selected }))(
  ({ items, path }) => {
    const selected = items.findIndex(item => item.toLowerCase() === path[1])
    return (
      <Row>
        <Menu
          defaultSelectedKeys={[selected]}
          theme="light"
          mode="horizontal"
          style={{ margin: 0 }}
        >
          {items.map((item, i) => (
            <Menu.Item key={i} style={{ width: 100 / items.length + '%' }}>
              <Link to={`/${path[0]}/${item.toLowerCase()}`}>
                <Col style={{ textAlign: 'center' }}>{item}</Col>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Row>
    )
  }
)
