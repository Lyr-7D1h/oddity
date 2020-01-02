import React, { useState } from 'react'
import { useEffect } from 'react'
import requester from '../../helpers/requester'
import { Form, Card, Input } from 'antd'

export default Form.create({ name: 'create_post_form' })(
  ({ threadId, form }) => {
    const { getFieldDecorator } = form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }

    return (
      <Card title={'Create new post'}>
        <Form {...formItemLayout}>
          <Form.Item label="Title">
            {getFieldDecorator('title', {
              rules: [{ required: true }]
            })(<Input />)}
          </Form.Item>
        </Form>
      </Card>
    )
  }
)
