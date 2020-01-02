import React, { useState } from 'react'
import { Card } from 'antd'
import RegisterForm from '../RegisterForm'
import Page from '../containers/Page'
import LoggedInRedirect from '../containers/LoggedInRedirect'
import Title from 'antd/lib/typography/Title'

import { Redirect } from 'react-router-dom'
import Centered from '../containers/Centered'

export default () => {
  const [accountCreated, setAccountCreate] = useState(false)

  const handleSubmit = () => {
    setAccountCreate(true)
  }

  return (
    <LoggedInRedirect>
      {!accountCreated || <Redirect to="/login" />}
      <Page>
        <Centered>
          <Card>
            <Title>Register</Title>
            <RegisterForm onSubmit={handleSubmit} />
          </Card>
        </Centered>
      </Page>
    </LoggedInRedirect>
  )
}
