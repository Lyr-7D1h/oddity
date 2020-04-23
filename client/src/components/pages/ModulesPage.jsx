import React, { useEffect, useState } from 'react'
import Title from 'antd/lib/typography/Title'
import ModulesTable from 'Components/ModulesTable'
import requester from 'Helpers/requester'
import { Alert } from 'antd'

export default () => {
  const [modules, setModules] = useState([])

  useEffect(() => {
    requester.get('modules').then((modules) => {
      modules.sort((a, b) => (a.enabled ? 1 : -1))
      setModules(modules.sort((a, b) => (a === b ? 0 : a ? -1 : 1))) // sets enabled first
    })
  }, [])

  return (
    <>
      {-1 === modules.indexOf((mod) => mod.route === '') ? (
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
    </>
  )
}
