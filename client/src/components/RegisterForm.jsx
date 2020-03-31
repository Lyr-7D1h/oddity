import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Link } from 'react-router-dom'
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Input, Tooltip, Checkbox, Button } from 'antd'

import notificationHandler from '../helpers/notificationHandler'
import requester from '../helpers/requester'
import { useState } from 'react'

export default () => {
  const [identifier, setIdentifier] = useState(null)

  const handleFinish = values => {
    requester
      .post('auth/register', values)
      .then(isValid => {
        if (isValid) {
          this.props.onSubmit()
          notificationHandler.success('Account Created')
        } else {
          notificationHandler.error('Wrong password or username')
        }
      })
      .catch(err => {
        console.error(err)
        notificationHandler.error('Invalid Input', err.message)
      })
  }

  const identifierHandler = e => {
    e.preventDefault()

    const identifier = e.target.value.toLowerCase().replace(' ', '_')
    this.setState({ identifier: identifier })
    return e.target.value
  }

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
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 14,
        offset: 6
      }
    }
  }
  return (
    <Form
      name="registration"
      scrollToFirstError
      {...formItemLayout}
      onFinish={handleFinish}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, min: 3, max: 30 }]}
      >
        <Input />
      </Form.Item>

      {identifier ? (
        <Form.Item
          getValueFromEvent
          name="identifier"
          label={
            <span>
              ID&nbsp;
              <Tooltip title="Your Identifier is used to Identify you and is most unique about you. You can not change this in the future!">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Input value={'#' + identifier} disabled />
        </Form.Item>
      ) : (
        ''
      )}

      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: 'email', required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, min: 8, max: 40 }]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Confirm Password"
        name="password_confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject("Passwords don't match")
            }
          })
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <ReCAPTCHA sitekey="6LddQMQUAAAAAE5yoKG_94ZchxPGZPSMk4OhzJ-R" />
      </Form.Item>

      <Form.Item
        {...tailFormItemLayout}
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject()
          }
        ]}
      >
        <Checkbox>
          I have read the <Link to="/tos">Terms of Service</Link>
        </Checkbox>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" block>
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}
