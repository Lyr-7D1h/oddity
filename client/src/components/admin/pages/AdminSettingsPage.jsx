import React from 'react'
import ConfigForm from 'Components/admin/components/ConfigForm'
import AdminPage from 'Components/admin/containers/AdminPage'

export default ({ match }) => {
  return (
    <AdminPage title="General Settings">
      <ConfigForm />
    </AdminPage>
  )
}
