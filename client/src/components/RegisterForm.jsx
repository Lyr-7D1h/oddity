import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Link, Redirect } from 'react-router-dom'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Form, Input, Tooltip, Checkbox, Button } from 'antd'

import notificationHandler from '../helpers/notificationHandler'
import requester from '../helpers/requester'
import { useState } from 'react'
import { connect } from 'react-redux'

export default connect((state) => ({ captcha: state.captcha }))(
  ({ captcha }) => {
    const [usingIdentifier, setUsingIdentifier] = useState(false)
    const [registered, setRegistered] = useState(false)
    const form = React.createRef()

    const handleFinish = (values) => {
      requester
        .post('auth/register', values)
        .then((isValid) => {
          if (isValid) {
            notificationHandler.success('Account Created')
            setRegistered(true)
          } else {
            notificationHandler.error('Wrong password or username')
          }
        })
        .catch((err) => {
          console.error(err)
          notificationHandler.error('Invalid Input', err.message)
        })
    }

    const handleCaptcha = (captchaValue) => {
      form.current.setFieldsValue({ captcha: captchaValue })
    }
    const handleExpireCatcha = () => {
      form.current.setFieldsValue({ captcha: null })
    }

    const identifierHandler = (e) => {
      e.preventDefault()

      const identifier = e.target.value
        .toLowerCase()
        .replace('-', '_')
        .match(/(^[a-z0-9])\w+[a-z0-9]$/g)

      if (identifier) {
        form.current.setFieldsValue({ identifier: identifier.join('') })
        setUsingIdentifier(true)
      }

      return e.target.value
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    }

    if (registered) {
      return <Redirect to="/login" />
    }

    return (
      <Form
        name="registration"
        scrollToFirstError
        {...formItemLayout}
        onFinish={handleFinish}
        ref={form}
      >
        <Form.Item
          getValueFromEvent={identifierHandler}
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Username is required' },
            {
              message: 'Username needs to have a length of 3-30',
              min: 3,
              max: 30,
            },
          ]}
        >
          <Input />
        </Form.Item>

        {usingIdentifier ? (
          <Form.Item
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
            <Input prefix="#" disabled />
          </Form.Item>
        ) : (
          ''
        )}

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: 'email', message: 'Email is invalid' },
            { required: true, message: 'Email is required' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Password is required' },
            {
              message: 'Password needs a length between 8-40',
              min: 8,
              max: 40,
            },
          ]}
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
            { required: true, message: 'Confirm your password' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject("Passwords don't match")
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <ReCAPTCHA
            onChange={handleCaptcha}
            onExpired={handleExpireCatcha}
            sitekey={captcha}
          />
        </Form.Item>
        <Form.Item
          name="captcha"
          rules={[{ required: true, message: 'Sorry no bots allowed' }]}
        >
          <Input hidden />
        </Form.Item>

        <Form.Item
          {...tailFormItemLayout}
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              required: true,
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject('You have to accept the Terms of Service'),
            },
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
)
