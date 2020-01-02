import React from 'react'
import { Card, Row, Col } from 'antd'
import LoginForm from '../components/LoginForm'
import Page from '../containers/Page'
import LoggedInRedirect from '../containers/LoggedInRedirect'
import Title from 'antd/lib/typography/Title'

export default () => {
  return (
    <LoggedInRedirect>
      <Page justify="center">
        <Row type="flex">
          <Col span={12}>
            <Card>
              <LoginForm />
            </Card>
          </Col>
          <Col span={12}>
            <Card bodyStyle={{ backgroundColor: 'black', color: 'white' }}>
              <Title level={2} style={{ color: 'white' }}>
                Steam <br />
                Coming soon
              </Title>
            </Card>
          </Col>
        </Row>
      </Page>
    </LoggedInRedirect>
  )
}
