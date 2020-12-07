import { Form, Input, Switch } from 'antd'
import QuestionDot from 'features/common/QuestionDot'
import SaveForm from 'features/common/SaveForm'
import requester from 'Helpers/requester'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

const mapInitialValues = (role, initPermissions) => {
  const initialValues = Object.assign({}, role)
  for (const key in initPermissions) {
    if ((initPermissions[key] & initialValues.permissions) > 0) {
      initialValues[key] = true
    } else {
      initialValues[key] = false
    }
  }
  return initialValues
}

const getGroupedPermissions = (initPermissions, permissionsDescriptions) => {
  const mappedPermissions = Object.keys(initPermissions)
    .filter((key) => key !== 'NONE' && key !== 'PUBLIC')
    .map((key) => ({
      value: initPermissions[key],
      key,
      description: permissionsDescriptions[key].description,
      module: permissionsDescriptions[key].module || 'General Permissions',
      details: permissionsDescriptions[key].details,
    }))

  let groupedPermissions = {}
  for (const perm of mappedPermissions) {
    if (groupedPermissions[perm.module]) {
      groupedPermissions[perm.module].push(perm)
    } else {
      groupedPermissions[perm.module] = [perm]
    }
  }
  return groupedPermissions
}

export default connect((state) => ({
  initPermissions: state.init.permissions,
  permissionsDescriptions: state.init.permissionsDescriptions,
}))(({ role, initPermissions, permissionsDescriptions, onFinish }) => {
  const [groupedPermissions, setGroupedPermissions] = useState([])
  const [initialValues, setInitialValues] = useState()

  useEffect(() => {
    setInitialValues(mapInitialValues(role, initPermissions))
    setGroupedPermissions(
      getGroupedPermissions(initPermissions, permissionsDescriptions)
    )
  }, [initPermissions, role, permissionsDescriptions])

  const handleOnFinish = (resolve, reject, newValues) => {
    let hasChanges = false

    const newRole = Object.assign({}, role)
    let newPermissions = newRole.permissions

    for (const key in newValues) {
      if (newValues[key] !== initialValues[key]) {
        if (initPermissions[key]) {
          newPermissions = newPermissions | initPermissions[key]
          hasChanges = true
        } else {
          newRole[key] = newValues[key]
          hasChanges = true
        }
      }
    }

    if (hasChanges) {
      requester
        .patch(`roles/${role.id}`, newRole)
        .then((role) => {
          const newValues = mapInitialValues(role, initPermissions)
          onFinish(role)
          resolve(newValues)
        })
        .catch(reject)
    } else {
      resolve(newValues)
    }
  }

  return (
    <SaveForm
      initialValues={initialValues}
      onFinish={handleOnFinish}
      name="RoleEditor"
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 12 }}
    >
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
              label={
                <>
                  {perm.description}&nbsp;
                  <QuestionDot message={perm.details} />
                </>
              }
            >
              <Switch />
            </Form.Item>
          ))}
        </div>
      ))}
    </SaveForm>
  )
})
