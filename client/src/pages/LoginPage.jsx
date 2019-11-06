import React from 'react'
import { Card, Row, Col } from 'antd'
import configReader from '../helpers/configReader'
import LoginForm from '../components/LoginForm'
import Page from '../containers/Page'
import LoggedInRedirect from '../components/LoggedInRedirect'
import Title from 'antd/lib/typography/Title'

export default ({ location }) => {
  const config = configReader(location)

  return (
    <LoggedInRedirect>
      <Page config={config} justify="center">
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
