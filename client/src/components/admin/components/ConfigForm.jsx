import React from 'react'
import { Input, Button } from 'antd'
import { Form } from 'antd'

import { connect } from 'react-redux'
import { updateConfig } from 'Actions/initActions'
import requester from 'Helpers/requester'
import notificationHandler from 'Helpers/notificationHandler'

const ConfigForm = ({ dispatch, config, ...props }) => {
  const handleFinish = (values) => {
    requester
      .patch('config/title', values)
      .then((resultConfig) => {
        config.title = resultConfig.title
        dispatch(updateConfig(config))
      })
      .catch((err) => {
        console.error(err)
        notificationHandler.error('Could not update Configuration', err.message)
      })
  }

  return (
    <Form onFinish={handleFinish} className="login-form">
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          block
        >
          change
        </Button>
      </Form.Item>
    </Form>
  )
}

const mapToProps = (state) => {
  return { config: state.init.config }
}

export default connect(mapToProps)(ConfigForm)
