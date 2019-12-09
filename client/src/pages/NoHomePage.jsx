import React from 'react'
import { Result, Button, Icon, Row } from 'antd'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <Result
      title="You have not set the home page"
      subTitle="Set a page to default/home in the admin panel"
      extra={
        <Row>
          <Link to="/admin">
            <Button type="primary" style={{ width: '30%', height: '50px' }}>
              ADMIN PANEL
              <Icon type="right" />
            </Button>
          </Link>
          <br />
          <Link to="/login">
            <Button
              type="primary"
              style={{ width: '30%', height: '50px', marginTop: '50px' }}
            >
              OR LOGIN FIRST
              <Icon type="right" />
            </Button>
          </Link>
        </Row>
      }
    />
  )
}
