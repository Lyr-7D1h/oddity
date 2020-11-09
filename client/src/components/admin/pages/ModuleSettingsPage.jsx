import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Row, Col, Spin } from 'antd'
import { RollbackOutlined } from '@ant-design/icons'
import Centered from '../../containers/Centered'
import moduleLoaderModules from '../../../../module_loader_imports/modules'
import QuestionDot from 'Components/QuestionDot'
import AdminPage from 'Components/admin/containers/AdminPage'
import requester from 'Helpers/requester'
import NotFoundPage from '../../pages/NotFoundPage'
import notificationHandler from 'Helpers/notificationHandler'
import { Link } from 'react-router-dom'
import Title from 'antd/lib/typography/Title'
import saveWrapper from 'Helpers/saveWrapper'
import { useDispatch } from 'react-redux'
import { updateModuleRoute } from 'Actions/initActions'

const Page = ({
  setHasChanges,
  setSaveHandler,
  setInitialValues,
  setResetHandler,
  initialValues: mod,
  match,
}) => {
  const [ImportedSettingsComponent, setImportedSettingsComponent] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!mod) {
      requester
        .get(`modules/identifier/${match.params.module}/enabled`)
        .then((mod) => {
          if (mod) {
            if (moduleLoaderModules[mod.name]) {
              const component = moduleLoaderModules[mod.name].adminPage
              if (component) {
                setImportedSettingsComponent(React.createElement(component))
              }
            }
            setInitialValues(mod)
            setResetHandler((mod) => {
              form.setFieldsValue(mod)
            })
            setSaveHandler((resolve, reject) =>
              form
                .validateFields()
                .then((values) => {
                  requester
                    .patch(`modules/${mod.id}`, values)
                    .then((module) => {
                      dispatch(updateModuleRoute(module.id, module.route))
                      resolve(module)
                    })
                    .catch((err) => reject(err))
                })
                .catch((err) => reject(err))
            )
          } else {
            setNotFound(true)
          }
        })
        .catch((err) => {
          console.error(err)
          notificationHandler.error('Something went wrong', err.message)
        })
    }
  }, [
    mod,
    dispatch,
    match,
    form,
    setInitialValues,
    setResetHandler,
    setSaveHandler,
  ])

  const Content = (
    <>
      {' '}
      <br />
      <Centered>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={mod}
          onValuesChange={() => setHasChanges()}
          form={form}
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
      {notFound ? (
        // TODO: different not found page
        <NotFoundPage />
      ) : (
        <>
          {mod ? (
            <>
              <Row>
                <Col span={6}>
                  <Link to="/admin/modules">
                    <Button icon={<RollbackOutlined />} block type="primary">
                      Back
                    </Button>
                  </Link>
                </Col>
              </Row>
              <Title>{mod.name}</Title>
            </>
          ) : (
            ''
          )}
          {!mod ? <Spin>{Content}</Spin> : Content}
          <br />
          <div className={!mod ? 'hidden' : ''}>
            {ImportedSettingsComponent}
          </div>
        </>
      )}
    </AdminPage>
  )
}

export default saveWrapper(Page, 'ModuleSettingsPage')
