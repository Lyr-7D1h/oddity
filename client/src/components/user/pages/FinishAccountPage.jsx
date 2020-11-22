import React, { useState } from 'react'
import Centered from '../../common/containers/Centered'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Steps, Row, Col, Button, Card, Typography, Layout, Menu } from 'antd'
import notificationHandler from '../../../helpers/notificationHandler'
import { updateUser } from '../../../redux/actions/userActions'
import ImageUpload from 'Components/common/ImageUpload'
import Title from 'antd/lib/typography/Title'
import Paragraph from 'antd/lib/typography/Paragraph'
import requester from 'Helpers/requester'
import { rootReset } from 'Actions/rootActions'
import ConnectThirdParty from 'Components/user/ConnectThirdParty'

const { Step } = Steps

const FinishAccountPage = ({ user, title, dispatch }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isNextList, setIsNextList] = useState([false])
  const [redirect, setRedirect] = useState(false)

  const next = () => {
    if (isNextList[currentStep] === null) {
      setIsNextList(isNextList.concat([false]))
    }

    if (currentStep === 2) {
      requester
        .put(`users/${user.id}/hasFinishedAccount`)
        .then(() => {
          dispatch(
            updateUser(Object.assign({}, user, { hasFinishedAccount: true }))
          )
          setRedirect(true)
        })
        .catch((err) => {
          notificationHandler.error('Could not finish account', err.message)
        })
    }

    setCurrentStep(currentStep + 1)
  }

  const previous = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleOnFinish = () => {
    setIsNextList(isNextList.concat([true]))
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
      Content = (
        <>
          <Typography.Title>Add an Avatar</Typography.Title>
          <Typography.Text>
            Make your profile yours by adding an avatar. Make yourself standout!
          </Typography.Text>
          <div style={{ marginBottom: 50 }}></div>
          <ImageUpload onFinish={handleOnFinish} />
          <div style={{ marginBottom: 50 }}></div>
        </>
      )
      break
    case 2:
      Content = (
        <>
          <Typography.Title>Connect to third parties</Typography.Title>
          <Typography.Text>
            This way you can interact with our system on these third parties or
            the other way around.
          </Typography.Text>
          <div style={{ marginBottom: 50 }}></div>
          <ConnectThirdParty />
        </>
      )
      break
    default:
      Content = ''
      break
  }

  if (redirect) {
    return <Redirect to={`/u/${user.identifier}`} />
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
            <Col span={24} style={{ marginBottom: '60px' }}>
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
                  {isNextList[currentStep] || currentStep === 2 ? (
                    <Button size="large" type="primary" onClick={next} block>
                      {currentStep === 2 ? 'Finish' : 'Next'} <RightOutlined />
                    </Button>
                  ) : (
                    <Button size="large" onClick={next} block>
                      Next <RightOutlined />
                    </Button>
                  )}
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
