import React, { useState } from 'react'
import Centered from '../containers/Centered'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Steps, Row, Col, Button, Card, Typography, Layout, Menu } from 'antd'
import notificationHandler from '../../helpers/notificationHandler'
import { updateUser } from '../../redux/actions/userActions'
import ImageUpload from 'Components/ImageUpload'
import Title from 'antd/lib/typography/Title'
import Paragraph from 'antd/lib/typography/Paragraph'
import requester from 'Helpers/requester'
import { rootReset } from 'Actions/rootActions'

const { Step } = Steps

const FinishAccountPage = ({ user, title, dispatch }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const next = () => {
    setCurrentStep(currentStep + 1)
  }

  const previous = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleLogout = () => {
    requester
      .logout()
      .then(() => {
        dispatch(updateUser({}))
        dispatch(rootReset())
        notificationHandler.success('Logged out successfully')
      })
      .catch(() => {
        dispatch(updateUser({})) // remove user from state
        notificationHandler.error('Something went wrong')
      })
  }

  const ConnectThirdParty = (
    <>
      <Typography.Title>Connect to third parties</Typography.Title>
      <Typography.Text>
        This way you can interact with our system on these third parties.
      </Typography.Text>
      <div style={{ marginBottom: 50 }}></div>
      <Row type="flex" style={{ marginBottom: 50 }}>
        <Col span={12}>
          <Card bodyStyle={{ backgroundColor: 'black', color: 'white' }}>
            <Typography.Title level={2} style={{ color: 'white' }}>
              Discord <br />
              Coming soon
            </Typography.Title>
          </Card>
        </Col>
        <Col span={12}>
          <Card bodyStyle={{ backgroundColor: 'black', color: 'white' }}>
            <Typography.Title level={2} style={{ color: 'white' }}>
              Steam <br />
              Coming soon
            </Typography.Title>
          </Card>
        </Col>
      </Row>
    </>
  )

  let Content
  switch (currentStep) {
    case 0:
      Content = (
        <>
          <Title>Welcome to {title}!</Title>
          <Paragraph>
            Before you enter this wonderfull community we would like you to go
            through these steps for creating a more complete account.
            <br /> By completing these steps you'll make it easier for others to
            recognize you and you'll show that you're an actual real person!
          </Paragraph>
        </>
      )
      break
    case 1:
      Content = <ImageUpload url={`/api/resources/users/${user.id}`} />
      break
    case 2:
      Content = <ConnectThirdParty />
      break
    default:
      Content = <Redirect to="/account" />
      break
  }

  return (
    <>
      <Layout theme="light" style={{ padding: '10px', minHeight: '100vh' }}>
        <Menu
          selectable={false}
          theme="light"
          style={{
            border: 'none',
            paddingLeft: '15px',
            paddingRight: '15px',
          }}
        >
          <Menu.Item style={{ float: 'left' }}>
            {user.username} ({user.email})
          </Menu.Item>
          <Menu.Item
            style={{ color: 'red', float: 'right' }}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu>
        <Card bordered={false} bodyStyle={{ minHeight: '80vh' }}>
          <Steps style={{ marginBottom: 50 }} current={currentStep}>
            <Step title="Created Account" />
            <Step title="Upload Profile Picture" />
            <Step title="Connect to third parties" />
          </Steps>
          <Row
            align="middle"
            gutter="15"
            justify="space-around"
            style={{ textAlign: 'center' }}
          >
            <Col span={24} style={{ marginBottom: '15px' }}>
              <Centered>{Content}</Centered>
            </Col>
            <div
              style={{
                padding: '15px',
                position: 'absolute',
                bottom: '15px',
                width: '100%',
              }}
            >
              <Row>
                <Col span={6}>
                  {currentStep > 0 ? (
                    <Button size="large" onClick={previous} block>
                      <LeftOutlined /> Back
                    </Button>
                  ) : (
                    ''
                  )}
                </Col>
                <Col offset={12} span={6}>
                  <Button size="large" type="primary" onClick={next} block>
                    Next <RightOutlined />
                  </Button>
                </Col>
              </Row>
            </div>
          </Row>
        </Card>
      </Layout>
    </>
  )
}

export default connect((state) => ({
  user: state.user,
  title: state.init.config.title,
}))(FinishAccountPage)
