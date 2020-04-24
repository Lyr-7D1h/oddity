import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Row, Col, Spin } from 'antd'
import { RollbackOutlined } from '@ant-design/icons'
import Centered from '../containers/Centered'
import moduleLoaderModules from '../../../module_loader_imports/modules'
import QuestionDot from 'Components/QuestionDot'
import { onChange } from 'Actions/saveActions'
import { connect } from 'react-redux'
import AdminPage from 'Components/containers/AdminPage'
import requester from 'Helpers/requester'
import NotFoundPage from './NotFoundPage'
import notificationHandler from 'Helpers/notificationHandler'
import { Link } from 'react-router-dom'

export default connect()(({ match, dispatch }) => {
  const [ImportedSettingsComponent, setImportedSettingsComponent] = useState('')
  const [module, setModule] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    requester
      .get(`modules/identifier/${match.params.module}`)
      .then((mod) => {
        if (mod) {
          setModule(mod)
          const component = moduleLoaderModules[mod.name].adminPage
          if (component) {
            setImportedSettingsComponent(React.createElement(component))
          }
        } else {
          setNotFound(true)
        }
      })
      .catch((err) => {
        console.error(err)
        notificationHandler.error('Something went wrong', err.message)
      })
  }, [match])

  const handleOnSave = () => {
    console.log('Handling save')
  }

  const handleOnChange = () => {
    console.log('on change')
    dispatch(onChange('ModulesSettingsPage', handleOnSave))
  }

  if (notFound) {
    return <NotFoundPage />
  }

  const Content = (
    <>
      {' '}
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
    </>
  )

  return (
    <AdminPage>
      <Row>
        <Col span={6}>
          <Link to="/admin/modules">
            <Button block type="primary">
              <RollbackOutlined />
              Back
            </Button>
          </Link>
        </Col>
      </Row>
      {!module ? <Spin>{Content}</Spin> : Content}
      <br />
      <div className={!module ? 'hidden' : ''}>{ImportedSettingsComponent}</div>
    </AdminPage>
  )
})
