import React, { useEffect, useState } from 'react'
import requester from 'Helpers/requester'
import { Alert } from 'antd'
import AdminPage from 'Components/admin/containers/AdminPage'
import ModulesTable from 'Components/admin/components/ModulesTable'
import errorHandler from 'Helpers/errorHandler'

export default () => {
  const [modules, setModules] = useState([])

  useEffect(() => {
    requester
      .get('modules')
      .then((modules) => {
        setModules(modules.sort((a, b) => (a === b ? 0 : a ? -1 : 1))) // sets enabled first
      })
      .catch(errorHandler)
  }, [])

  return (
    <AdminPage title="Modules">
      {-1 === modules.findIndex((mod) => mod.route === '') &&
      modules.length > 0 ? (
        <>
          <Alert
            message="No home module set"
            description="Change the route of one of the enabled modules to be empty"
            type="warning"
            showIcon
          />
          <br />
        </>
      ) : (
        ''
      )}
      <ModulesTable modules={modules} />
    </AdminPage>
  )
}
