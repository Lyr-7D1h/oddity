import AdminPage from 'Components/admin/containers/AdminPage'
import errorHandler from 'Helpers/errorHandler'
import requester from 'Helpers/requester'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

export default () => {
  const [roles, setRoles] = useState([])
  useEffect(() => {
    requester
      .get('roles')
      .then((roles) => {
        setRoles(roles)
      })
      .catch((err) => errorHandler(err))
  }, [])

  const columns = [
    { dataIndex: 'name', dataType: 'string' },
    { dataIndex: 'isDefault', dataType: 'boolean' },
    { dataIndex: 'color', dataType: 'number' },
  ]

  return <AdminPage title="Roles"></AdminPage>
}
