import React, { useState } from 'react'
import { Card, Row, Col } from 'antd'
import LoginForm from '../components/LoginForm'
import Page from '../containers/Page'
import LoggedInRedirect from '../components/LoggedInRedirect'
import Title from 'antd/lib/typography/Title'

import notificationHandler from '../helpers/notificationHandler'
import requester from '../helpers/requester'

import { connect } from 'react-redux'
import { updateUser } from '../redux/actions/userActions'
import getUser from '../helpers/getUser'

const LoginPage = ({ location, user, updateUser }) => {
  // if no username not logged in
  const [loggedIn] = useState(user.username !== undefined)

  const handleLogin = values => {
    requester
      .login(values)
      .then(isValid => {
        if (isValid) {
          updateUser(getUser())
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

const mapStateToProps = state => {
  return {
    user: state.user
  }
}
const mapActionsToProps = {
  updateUser
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(LoginPage)
