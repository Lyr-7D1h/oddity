import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Row, Col } from 'antd'
import { RollbackOutlined } from '@ant-design/icons'
import Centered from '../containers/Centered'
import moduleLoaderModules from '../../../module_loader_imports/modules'
import QuestionDot from 'Components/QuestionDot'
import { onSave, onChange } from 'Actions/saveActions'
import { connect } from 'react-redux'
import AdminPage from 'Components/containers/AdminPage'

export default connect()(({ dispatch, module, onClose }) => {
  const [ImportedSettingsComponent, setImportedSettingsComponent] = useState('')

  useEffect(() => {
    const component = moduleLoaderModules[module.name].adminPage
    if (component) {
      setImportedSettingsComponent(React.createElement(component))
    }
  }, [module])

  const handleOnSave = () => {
    console.log('Handling save')
  }

  const handleOnChange = () => {
    console.log('on change')
    dispatch(onChange('ModulesSettingsPage', handleOnSave))
  }

  return (
    <AdminPage>
      <Row>
        <Col span={6}>
          <Button block type="primary" onClick={() => onClose()}>
            <RollbackOutlined />
            Back
          </Button>
        </Col>
      </Row>
      <br />
      <Centered>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={module}
          onValuesChange={handleOnChange}
        >
          <Form.Item
            label={
              <>
                Title&nbsp;
                <QuestionDot message="Title of the module (what is displayed in the navigation bar)" />
              </>
            }
            name="title"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <>
                Route&nbsp;
                <QuestionDot message="The url path to the module. If empty this will become your your home module" />
              </>
            }
            name="route"
          >
            <Input prefix="/" />
          </Form.Item>
        </Form>
      </Centered>
      <br />
      {ImportedSettingsComponent}
    </AdminPage>
  )
})
