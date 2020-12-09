import React from 'react'
import { RightOutlined } from '@ant-design/icons'
import { Result, Button } from 'antd'
import { Link } from 'react-router-dom'
import Centered from 'Features/common/containers/Centered'
import Page from 'Features/common/containers/Page'
import { connect } from 'react-redux'
import hasPermission from 'Helpers/hasPermission'

export default connect((state) => ({
  isAdmin: hasPermission('ADMIN', state.user),
}))(({ isAdmin }) => {
  return (
    <Page>
      <Result
        title="There is no home page set"
        subTitle="Set a page to default/home in the admin panel"
        extra={
          <Centered>
            {isAdmin ? (
              <Link to="/admin">
                <Button type="primary" style={{ height: '50px' }}>
                  ADMIN PANEL
                  <RightOutlined />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button type="primary" style={{ height: '50px' }}>
                  LOGIN
                  <RightOutlined />
                </Button>
              </Link>
            )}
          </Centered>
        }
      />
    </Page>
  )
})
