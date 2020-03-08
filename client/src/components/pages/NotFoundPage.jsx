import React from 'react'
import { Result, Button, Icon } from 'antd'
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
            <Icon type="left" />
            BACK HOME
          </Button>
        </Link>
      }
    />
  )
}
