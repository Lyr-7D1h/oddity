import { Form, Input, Skeleton, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

export default connect((state) => ({
  initPermissions: state.init.permissions,
  permissionsDescriptions: state.init.permissionsDescriptions,
}))(({ role, initPermissions, permissionsDescriptions }) => {
  const [groupedPermissions, setGroupedPermissions] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    const groupedPermissions = {}
    const initialValues = role
    if (initialValues.color) initialValues.color = '#FFFFFF' //'#' + initialValues.color.toString(16)
    console.log(initialValues)
    Object.keys(initPermissions)
      .filter((key) => key !== 'NONE' && key !== 'PUBLIC')
      .map((key) => {
        if ((initPermissions[key] & role.permissions) > 0) {
          initialValues[key] = true
        } else {
          initialValues[key] = false
        }
        return {
          hasValue: (initPermissions[key] & role.permissions) > 0,
          value: initPermissions[key],
          key,
          description: permissionsDescriptions[key].description,
          module: permissionsDescriptions[key].module || 'General Permissions',
          details: permissionsDescriptions[key].details,
        }
      })
      .forEach((perm) => {
        if (groupedPermissions[perm.module]) {
          groupedPermissions[perm.module].push(perm)
        } else {
          groupedPermissions[perm.module] = [perm]
        }
      })

    form.setFieldsValue(initialValues)
    setGroupedPermissions(groupedPermissions)
  }, [initPermissions, role, permissionsDescriptions])

  console.log(groupedPermissions)

  return (
    <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 12 }}>
      <Form.Item name="name" label="Role Name">
        <Input />
      </Form.Item>
      <Form.Item name="color" label="Role Color">
        <Input type="color" />
      </Form.Item>
      {Object.keys(groupedPermissions).map((group, i) => (
        <div key={group + i}>
          {group}
          {groupedPermissions[group].map((perm, i) => (
            <Form.Item
              valuePropName="checked"
              key={i}
              name={perm.key}
              label={perm.description}
            >
              <Switch />
            </Form.Item>
          ))}
        </div>
      ))}
    </Form>
  )
})
