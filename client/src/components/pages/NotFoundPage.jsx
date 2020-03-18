import React from 'react'
import { LeftOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom'

export default () => {
  return (
    <Result
      status="warning"
      title="Not Found"
      subTitle="You've lost your way, come back home.."
      extra={
        <Link to="/">
          <Button type="primary" style={{ width: '30%', height: '50px' }}>
            <LeftOutlined />
            BACK HOME
          </Button>
        </Link>
      }
    />
  );
}
