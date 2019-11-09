import React, { useState } from 'react'
import { Card, Row, Col } from 'antd'
import LoginForm from '../components/LoginForm'
import Page from '../containers/Page'
import LoggedInRedirect from '../components/LoggedInRedirect'
import Title from 'antd/lib/typography/Title'
import Cookies from 'js-cookie'

import notificationHandler from '../helpers/notificationHandler'
import requester from '../helpers/requester'

export default ({ location }) => {
  const [loggedIn, setLoggedIn] = useState(Cookies.get('user') !== undefined)

  const handleLogin = values => {
    requester
      .login(values)
      .then(isValid => {
        if (isValid) {
          setLoggedIn(true)
          notificationHandler.success('Login Succeeded')
        } else {
          notificationHandler.error('Wrong password or username')
        }
      })
      .catch(err => {
        notificationHandler.error('Wrong password or username')
      })
  }

  return (
    <LoggedInRedirect loggedIn={loggedIn}>
      <Page justify="center">
        <Row type="flex">
          <Col span={12}>
            <Card>
              <LoginForm onSubmit={handleLogin} />
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
