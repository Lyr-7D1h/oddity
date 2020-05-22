import React, { useEffect } from 'react'
import { Form, Result, Spin } from 'antd'
import saveWrapper from 'Helpers/saveWrapper'

let shouldSetHandler = true

// TODO: Async inital values

/**
 * @param {onFinish*} onFinish - Promise callback with the update values
 */
const SaveForm = ({
  setSaveHandler,
  setResetHandler,
  setHasChanges,
  setInitialValues,
  initialValues,

  onFinish,
  children,
  ...props
}) => {
  const [form] = Form.useForm()

  const resetForm = (initialValues) => {
    form.resetFields()
    // form.setFieldsValue(initialValues)
  }

  const handleOnFinish = (resolve, reject) => {
    form
      .validateFields()
      .then((values) => {
        new Promise((res, rej) => {
          onFinish(res, rej, values)
        })
          .then((updatedValue) => {
            resetForm()
            resolve(updatedValue)
          })
          .catch((err) => reject(err))
      })
      .catch((err) => {
        reject(err)
      })
  }

  useEffect(() => {
    if (shouldSetHandler) {
      console.log('Setting handlers..')
      setSaveHandler(handleOnFinish)
      setResetHandler(resetForm)
      shouldSetHandler = false
    }
  })

  if (!initialValues) {
    return <Result icon={<Spin />} />
  }

  return (
    <Form
      initialValues={initialValues}
      onValuesChange={() => setHasChanges()}
      form={form}
      {...props}
    >
      {children}
    </Form>
  )
}

export default saveWrapper(SaveForm)
