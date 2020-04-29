import React, { useEffect, useState } from 'react'
import Title from 'antd/lib/typography/Title'
import requester from 'Helpers/requester'
import { Alert } from 'antd'
import AdminPage from 'Components/containers/AdminPage'
import ModulesTable from 'Components/ModulesTable'

export default () => {
  const [modules, setModules] = useState([])

  useEffect(() => {
    requester.get('modules').then((modules) => {
      setModules(modules.sort((a, b) => (a === b ? 0 : a ? -1 : 1))) // sets enabled first
    })
  }, [])

  return (
    <AdminPage>
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
      <Title>Modules</Title>
      <ModulesTable modules={modules} />
    </AdminPage>
  )
}
