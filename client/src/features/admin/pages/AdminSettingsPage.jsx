import React from 'react'
import ConfigForm from 'Features/admin/components/ConfigForm'
import AdminPage from 'Features/admin/containers/AdminPage'

export default ({ match }) => {
  return (
    <AdminPage title="General Settings">
      <ConfigForm />
    </AdminPage>
  )
}
