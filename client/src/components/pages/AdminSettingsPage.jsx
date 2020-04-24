import React from 'react'
import Title from 'antd/lib/typography/Title'
import ConfigForm from 'Components/ConfigForm'
import AdminPage from 'Components/containers/AdminPage'

export default ({ match }) => {
  return (
    <AdminPage>
      <Title>General Settings</Title>
      <ConfigForm />
    </AdminPage>
  )
}
