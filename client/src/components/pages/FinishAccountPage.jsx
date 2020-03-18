import React, { useState } from 'react'
import Centered from '../containers/Centered'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { InboxOutlined, LeftOutlined, RightOutlined, UploadOutlined } from '@ant-design/icons';
import { Steps, Upload, Avatar, Row, Col, Button, Card, Typography, Layout } from 'antd';
import notificationHandler from '../../helpers/notificationHandler'
import { updateUser } from '../../redux/actions/userActions'

const { Step } = Steps

const FinishAccountPage = ({ user, dispatch }) => {
  const [imgUrl, setImgUrl] = useState('')
  const [currentStep, setCurrentStep] = useState(1)

  const props = {
    name: 'file',
    multiple: false,
    accept: 'image/jpeg, image/png',
    showUploadList: false,
    action: `api/resources/users/${user.id}`,

    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
      }
      if (status === 'done') {
        setImgUrl(info.file.response.url)
        notificationHandler.success('Uploaded Profile Picture successfully')
      } else if (status === 'error') {
        notificationHandler.error(
          `file upload failed.`,
          info.file.response.message || ''
        )
      }
    }
  }

  const next = () => {
    if (currentStep + 1 === 3) {
      const newUser = { ...user }
      newUser.avatar = imgUrl
      dispatch(updateUser(newUser))
    }
    setCurrentStep(currentStep + 1)
  }

  const previous = () => {
    setCurrentStep(currentStep - 1)
  }

  const ImageUpload =
    imgUrl.length > 0 ? (
      <>
        <Row style={{ marginBottom: 50 }}>
          <Col span={8}>
            <Avatar size={200} shape="square" src={imgUrl} />
          </Col>
          <Col span={6}>
            <Avatar size={120} shape="square" src={imgUrl} />
          </Col>
          <Col span={6}>
            <Avatar size={75} src={imgUrl} />
          </Col>
          <Col span={4}>
            <Avatar size={50} src={imgUrl} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Upload {...props} style={{ width: '100vw' }}>
              <Button type="secundary">
                <UploadOutlined /> Upload other image
              </Button>
            </Upload>
          </Col>
          <Col span={12}>
            <Button type="primary" onClick={next} block>
              Next <RightOutlined />
            </Button>
          </Col>
        </Row>
      </>
    ) : (
      <Upload.Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
      </Upload.Dragger>
    )

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
      <Row>
        <Col span={12}>
          <Button onClick={previous} block>
            <LeftOutlined /> Back
          </Button>
        </Col>
        <Col span={12}>
          <Button type="primary" onClick={next} block>
            Finish <RightOutlined />
          </Button>
        </Col>
      </Row>
    </>
  )

  return (
    <Layout style={{ padding: '10px' }}>
      <Typography.Title style={{ marginBottom: '50px', textAlign: 'center' }}>
        Finish Account
      </Typography.Title>
      <Steps progressDot style={{ marginBottom: 50 }} current={currentStep}>
        <Step title="Created Account" />
        <Step title="Upload Profile Picture" />
        <Step title="Connect to third parties" />
      </Steps>
      <Centered>
        {currentStep === 1 && ImageUpload}
        {currentStep === 2 && ConnectThirdParty}
        {currentStep === 3 && <Redirect to="/account"></Redirect>}
      </Centered>
    </Layout>
  )
}

export default connect(state => ({ user: state.user }))(FinishAccountPage)
