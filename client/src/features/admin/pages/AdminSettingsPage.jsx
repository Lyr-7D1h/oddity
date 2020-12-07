import React from 'react'
import ConfigForm from 'features/admin/components/ConfigForm'
import AdminPage from 'features/admin/containers/AdminPage'

export default ({ match }) => {
  return (
    <AdminPage title="General Settings">
      <ConfigForm />
    </AdminPage>
  )
}
