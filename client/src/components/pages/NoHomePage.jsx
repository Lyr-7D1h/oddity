import React from 'react'
import { RightOutlined } from '@ant-design/icons';
import { Result, Button, Row } from 'antd';
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
              <RightOutlined />
            </Button>
          </Link>
          <br />
          <Link to="/login">
            <Button
              type="primary"
              style={{ width: '30%', height: '50px', marginTop: '50px' }}
            >
              OR LOGIN FIRST
              <RightOutlined />
            </Button>
          </Link>
        </Row>
      }
    />
  );
}
