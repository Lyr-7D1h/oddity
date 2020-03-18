import React from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button } from 'antd';

import { connect } from 'react-redux'
import { updateConfig } from '../redux/actions/configActions'

const ConfigForm = ({ dispatch, config, ...props }) => {
  const handleSubmit = e => {
    e.preventDefault()
    const data = { ...config }
    data.title = e.target[0].value
    dispatch(updateConfig(data))
  }

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        <Input type="text" name="title" placeholder={config.title} required />
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

const mapToProps = state => {
  return { config: state.config }
}

export default connect(mapToProps)(ConfigForm)
