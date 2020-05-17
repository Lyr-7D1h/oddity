import React, { useState } from 'react'
import { Row, Col, Avatar, Upload, Button, message } from 'antd'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons'
import Centered from './containers/Centered'
import { connect } from 'react-redux'
import { updateUser } from 'Actions/userActions'

export default connect((state) => ({
  user: state.user,
}))(({ user, onFinish, dispatch }) => {
  const [imgUrl, setImgUrl] = useState(user.avatar)
  let finished = false

  const uploadSettings = {
    name: 'file',
    multiple: false,
    accept: '.png, .jpg',
    showUploadList: false,
    action: `/api/resources/users/${user.id}`,

    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        message.loading({ content: 'Uploading..', key: 'image_uploader' })
      }
      if (status === 'done') {
        if (!finished) {
          onFinish(info.file.response.url)
          finished = true
        }
        user.avatar = info.file.response.url
        dispatch(updateUser(user))

        setImgUrl(info.file.response.url)
        message.success({ content: 'Upload Finished', key: 'image_uploader' })
      } else if (status === 'error') {
        message.error({
          content: 'File upload failed: ' + info.file.response.message || '',
          key: 'image_uploader',
        })
      }
    },
  }

  if (imgUrl) {
    return (
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
        <Centered>
          <Upload {...uploadSettings} style={{ width: '100vw' }}>
            <Button size="large" type="secundary">
              <UploadOutlined /> Upload other image
            </Button>
          </Upload>
        </Centered>
      </>
    )
  } else {
    return (
      <Upload.Dragger {...uploadSettings}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag a file to this area to upload
        </p>
        <p className="ant-upload-hint">Support for a single image upload.</p>
      </Upload.Dragger>
    )
  }
})
