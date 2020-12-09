import { Space } from 'antd'
import AdminPage from 'Features/admin/containers/AdminPage'
import React from 'react'
import RolesTable from '../components/RolesTable'

export default () => {
  return (
    <AdminPage customLayout={true}>
      <Space />
      <RolesTable />
    </AdminPage>
  )
}
