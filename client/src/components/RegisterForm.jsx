import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Link } from 'react-router-dom'
import { Form, Input, Tooltip, Icon, Checkbox, Button } from 'antd'

import notificationHandler from '../helpers/notificationHandler'
import requester from '../helpers/requester'

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    identifier: ''
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        requester
          .post('users')
          .then(isValid => {
            if (isValid) {
              this.props.onSubmit()
              notificationHandler.success('Account Created')
            } else {
              notificationHandler.error('Wrong password or username')
            }
          })
          .catch(err => {
            notificationHandler.error('Invalid Input')
          })
      } else {
        notificationHandler.error('Invalid Input')
      }
    })
  }

  identifierHandler = e => {
    e.preventDefault()

    const identifier = e.target.value.toLowerCase().replace(' ', '_')
    this.setState({ identifier: identifier })
    return e.target.value
  }

  handleConfirmBlur = e => {
    const { value } = e.target
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  setCaptcha = val => {
    this.props.form.setFieldsValue({ captcha: val })
    this.setState({ captchaValue: val })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { autoCompleteResult } = this.state

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
          span: 16,
          offset: 6
        }
      }
    }

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        {/* Username */}
        <Form.Item label="Username">
          {getFieldDecorator('username', {
            getValueFromEvent: this.identifierHandler,
            rules: [
              {
                required: true,
                message: 'Please input your nickname',
                whitespace: true
              }
            ]
          })(<Input />)}
        </Form.Item>

        {/* Identifier */}
        {!this.state.identifier || (
          <Form.Item
            label={
              <span>
                ID&nbsp;
                <Tooltip title="Your Identifier is used to Identify you and is most unique about you. You can not change this in the future!">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            <Input value={'#' + this.state.identifier} disabled />
          </Form.Item>
        )}

        {/* E-mail */}
        <Form.Item label="E-mail">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail'
              },
              {
                required: true,
                message: 'Please input your E-mail'
              }
            ]
          })(<Input />)}
        </Form.Item>

        {/* Password */}
        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password'
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password'
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>

        {/* Captcha */}
        <Form.Item
          extra="We must make sure that your are a human."
          {...tailFormItemLayout}
        >
          <ReCAPTCHA
            sitekey="6LddQMQUAAAAAE5yoKG_94ZchxPGZPSMk4OhzJ-R"
            onChange={this.setCaptcha}
          />
          {getFieldDecorator('captcha', {
            rules: [
              {
                required: true,
                message: 'Please fill in the captcha'
              }
            ]
          })(<Input hidden />)}
        </Form.Item>

        {/* TOS */}
        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
            rules: [{ required: true }]
          })(
            <Checkbox>
              I have read the <Link to="/tos">Terms of Service</Link>
            </Checkbox>
          )}
        </Form.Item>

        {/* Register */}
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: 'register' })(RegistrationForm)
