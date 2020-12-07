import { Card, Layout, Skeleton, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import errorHandler from 'Helpers/errorHandler'
import requester from 'Helpers/requester'
import React, { useState, useEffect } from 'react'
import RoleEditor from './RoleEditor'
import VertNavSelected from '../../common/VertNavSelected'

export default () => {
  const [roles, setRoles] = useState(null)
  const [selectedRole, setSelectedRole] = useState({})

  useEffect(() => {
    requester
      .get('roles')
      .then((roles) => {
        if (roles[0]) setSelectedRole(roles[0])
        setRoles(roles)
      })
      .catch((err) => errorHandler(err))
  }, [])

  const updateRoles = (newRole) => {
    setSelectedRole(newRole)
    setRoles(
      roles.map((role) => {
        if (role.id === newRole.id) {
          return newRole
        } else {
          return role
        }
      })
    )
  }

  return (
    <Layout>
      <Space />
      <Layout style={{ padding: '10px 0' }}>
        <Layout.Sider className="component-background">
          <VertNavSelected
            selected={selectedRole.id}
            items={roles}
            onClick={setSelectedRole}
          />
        </Layout.Sider>
        <Layout.Content>
          <Card>
            {roles === null ? (
              <Skeleton active />
            ) : (
              <>
                <Title>{selectedRole.name}</Title>
                <RoleEditor role={selectedRole} onFinish={updateRoles} />
              </>
            )}
          </Card>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
