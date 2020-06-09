import React, { useEffect } from 'react'
import { Form, Result, Spin } from 'antd'
import saveWrapper from 'Helpers/saveWrapper'

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

  const resetForm = () => {
    console.log('Reseting')
    form.resetFields()
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
    setSaveHandler(handleOnFinish)
    setResetHandler(resetForm)
  })

  if (!initialValues) {
    return <Result icon={<Spin />} />
  }

  console.log('Setting initial values ', initialValues)
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

// Run once should be run for each creation
export default (props) => {
  const Wrapped = saveWrapper(SaveForm, props.name)
  return <Wrapped {...props} />
}
