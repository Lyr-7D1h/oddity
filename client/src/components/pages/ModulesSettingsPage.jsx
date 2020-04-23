import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Row, Col } from 'antd'
import { RollbackOutlined } from '@ant-design/icons'
import Centered from '../containers/Centered'
import moduleLoaderModules from '../../../module_loader_imports/modules'
import QuestionDot from 'Components/QuestionDot'

export default ({ module, onClose }) => {
  const [ImportedSettingsComponent, setImportedSettingsComponent] = useState('')

  useEffect(() => {
    const component = moduleLoaderModules[module.name].adminPage
    if (component) {
      setImportedSettingsComponent(React.createElement(component))
    }
  }, [module])

  // const routeChangeHandler = (id, value) => {
  //   setModules(
  //     modules.map((mod) => {
  //       if (mod.id === id) mod.route = value
  //       return mod
  //     })
  //   )
  //   let shouldAdd = true
  //   const routeChanges = changes.map((change) => {
  //     if (change.id === id) {
  //       shouldAdd = false
  //       return { id: id, route: value }
  //     } else {
  //       return change
  //     }
  //   })
  //   if (shouldAdd) routeChanges.push({ id, route: value })

  //   setChanges(routeChanges)
  // }

  // const handleSave = () => {
  //   changes.forEach((change) => {
  //     requester
  //       .patch(`modules/${change.id}/route`, change)
  //       .then((updatedModules) => {
  //         setModules(
  //           modules.map((mod) => {
  //             const umod = updatedModules.find((umod) => umod.id === mod.id)
  //             if (umod) mod.route = umod.route
  //             return mod
  //           })
  //         )
  //         setChanges([])
  //       })
  //       .catch((err) => {
  //         console.error(err)
  //         setChanges([])
  //         notificationHandler.error('Could not update routes', err.message)
  //       })
  //   })
  // }

  return (
    <>
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
    </>
  )
}
