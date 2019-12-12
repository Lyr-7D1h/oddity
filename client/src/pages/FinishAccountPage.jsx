import React, { useState } from 'react'
import Page from '../containers/Page'
import Centered from '../containers/Centered'
import { Redirect } from 'react-router-dom'
import {
  Steps,
  Upload,
  Icon,
  Avatar,
  Row,
  Col,
  Button,
  Card,
  Typography
} from 'antd'
import notificationHandler from '../helpers/notificationHandler'

const { Step } = Steps

export default () => {
  const [imgUrl, setImgUrl] = useState('')
  const [currentStep, setCurrentStep] = useState(2)
  const props = {
    name: 'file',
    multiple: false,
    accept: 'image/jpeg, image/png',
    showUploadList: false,
    previewImage: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',

    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file)
      }
      if (status === 'done') {
        setImgUrl(info.file.response.url)
        notificationHandler.success('Uploaded Profile Picture successfully')
      } else if (status === 'error') {
        notificationHandler.error(`file upload failed.`)
      }
    }
  }

  const next = () => {
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
                <Icon type="upload" /> Upload other image
              </Button>
            </Upload>
          </Col>
          <Col span={12}>
            <Button type="primary" onClick={next} block>
              Next <Icon type="right" />
            </Button>
          </Col>
        </Row>
      </>
    ) : (
      <Upload.Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
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
            <Icon type="left" /> Back
          </Button>
        </Col>
        <Col span={12}>
          <Button type="primary" onClick={next} block>
            Finish <Icon type="right" />
          </Button>
        </Col>
      </Row>
    </>
  )

  return (
    <Page>
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
    </Page>
  )
}
