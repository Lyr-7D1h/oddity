import React from 'react'
import { Input, Form } from 'antd'
import SaveForm from './SaveForm'
import { connect } from 'react-redux'
import QuestionDot from './QuestionDot'
import requester from 'Helpers/requester'
import { updateUser } from 'Actions/userActions'

export default connect((state) => ({ user: state.user }))(
  ({ user, dispatch }) => {
    const handleFinish = (resolve, reject, values) => {
      requester
        .put(`users/${user.id}`, values)
        .then(() => {
          user.email = values.email
          user.username = values.username
          dispatch(updateUser(user))
          resolve(user)
        })
        .catch((err) => {
          reject(err)
        })
    }

    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }

    const preflightValidator = (field, value) => {
      return new Promise((resolve, reject) => {
        if (user[field] === value) return resolve()
        if (value === '') return reject(`${capitalize(field)} cannot be empty`)
        requester
          .post('users/preflight', { [field]: value })
          .then((is_taken) => {
            if (is_taken) reject(`${value} is taken`)
            resolve()
          })
          .catch((err) => {
            console.error(err)
            reject('something went wrong')
          })
      })
    }

    const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1)

    return (
      <SaveForm
        {...layout}
        name="UserInformationForm"
        initialValues={user}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Username"
          name="username"
          hasFeedback
          rules={[
            {
              message: 'Username needs to have a length of 3-30',
              min: 3,
              max: 30,
            },
            {
              validator: (_, value) => preflightValidator('username', value),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="identifier"
          hasFeedback
          label={
            <>
              Identifier&nbsp;
              <QuestionDot message="Your Identifier is used to Identify you and is most unique about you. You can not change this." />
            </>
          }
        >
          <Input prefix="#" disabled />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          hasFeedback
          rules={[
            { type: 'email', message: 'Email is invalid' },
            { validator: (_, value) => preflightValidator('email', value) },
          ]}
        >
          <Input />
        </Form.Item>
      </SaveForm>
    )
  }
)
