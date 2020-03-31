import React from 'react'
import { Card } from 'antd'
import RegisterForm from '../RegisterForm'
import Page from '../containers/Page'
import LoggedInRedirect from '../containers/LoggedInRedirect'
import Title from 'antd/lib/typography/Title'

import Centered from '../containers/Centered'

export default props => {
  return (
    <LoggedInRedirect>
      <Page>
        <Centered>
          <Card>
            <Title>Register</Title>
            <RegisterForm />
          </Card>
        </Centered>
      </Page>
    </LoggedInRedirect>
  )
}
