import React from 'react'
import { Input, Form } from 'antd'
import SaveForm from './SaveForm'
import { connect } from 'react-redux'
import requester from 'Helpers/requester'

export default connect((state) => ({ userId: state.user.id }))(({ userId }) => {
  const handleFinish = (resolve, reject, values) => {
    console.log(values)
    requester
      .put(`users/${userId}/password`, {
        old_password: values.old_password,
        new_password: values.new_password,
      })
      .then(() => resolve({}))
      .catch((err) => {
        reject(err)
      })
  }

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  }

  return (
    <SaveForm
      {...layout}
      name="SecurityForm"
      initialValues={{}}
      onFinish={handleFinish}
    >
      <Form.Item
        label="Old Password"
        name="old_password"
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
        label="New Password"
        name="new_password"
        rules={[
          { required: true, message: 'Password is required' },
          {
            message: 'Password needs a length between 8-40',
            min: 8,
            max: 40,
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('old_password') !== value) {
                return Promise.resolve()
              }
              return Promise.reject('Can not be the same as your old password')
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Confirm Password"
        name="confirm_password"
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: 'Confirm your password' },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('new_password') === value) {
                return Promise.resolve()
              }
              return Promise.reject("Passwords don't match")
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
    </SaveForm>
  )
})
