import React from 'react'
import { RightOutlined } from '@ant-design/icons'
import { Result, Button, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import Centered from 'Components/containers/Centered'

export default () => {
  return (
    <Result
      title="You have not set the home page"
      subTitle="Set a page to default/home in the admin panel"
      extra={
        <Centered>
          <Row>
            <Col span={12}>
              <Link to="/admin">
                <Button type="primary" style={{ height: '50px' }}>
                  ADMIN PANEL
                  <RightOutlined />
                </Button>
              </Link>
            </Col>
            <Col span={12}>
              <Link to="/login">
                <Button type="primary" style={{ height: '50px' }}>
                  OR LOGIN FIRST
                  <RightOutlined />
                </Button>
              </Link>
            </Col>
          </Row>
        </Centered>
      }
    />
  )
}
