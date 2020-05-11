import React, { useState } from 'react'
import { Row, Col, Avatar, Upload } from 'antd'
import notificationHandler from 'Helpers/notificationHandler'
import { InboxOutlined } from '@ant-design/icons'

export default ({ url }) => {
  const [imgUrl, setImgUrl] = useState('')

  const uploadSettings = {
    name: 'file',
    multiple: false,
    accept: '.png, .jpg',
    showUploadList: false,
    action: url,

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
    },
  }

  return imgUrl.length > 0 ? (
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
      {/* <Row>
        <Col span={12}>
          <Upload {...uploadSettings} style={{ width: '100vw' }}>
            <Button type="secundary">
              <UploadOutlined /> Upload other image
            </Button>
          </Upload>
        </Col>
    
      </Row> */}
    </>
  ) : (
    <Upload.Dragger {...uploadSettings}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">Support for a single or bulk upload.</p>
    </Upload.Dragger>
  )
}
