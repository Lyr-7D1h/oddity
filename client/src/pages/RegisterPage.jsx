import React, { useState } from 'react'
import { Card, Row, Col } from 'antd'
import RegisterForm from '../components/RegisterForm'
import Page from '../containers/Page'
import LoggedInRedirect from '../components/LoggedInRedirect'
import Title from 'antd/lib/typography/Title'

import { Redirect } from 'react-router-dom'

export default () => {
  const [accountCreated, setAccountCreate] = useState(false)

  const handleSubmit = () => {
    setAccountCreate(true)
  }

  return (
    <LoggedInRedirect>
      {!accountCreated || <Redirect to="/login" />}
      <Page>
        <Row type="flex" ustify="center" align="middle">
          <Col span={6} />
          <Col span={12}>
            <Card>
              <Title style={{ textAlign: 'center' }}>Register</Title>
              <RegisterForm onSubmit={handleSubmit} />
            </Card>
          </Col>
          <Col span={6} />
        </Row>
      </Page>
    </LoggedInRedirect>
  )
}
