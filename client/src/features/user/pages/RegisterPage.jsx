import React from 'react'
import { Card } from 'antd'
import RegisterForm from '../RegisterForm'
import Page from '../../common/containers/Page'
import LoggedInRedirect from '../../common/containers/LoggedInRedirect'
import Title from 'antd/lib/typography/Title'

import Centered from '../../common/containers/Centered'

export default (props) => {
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
