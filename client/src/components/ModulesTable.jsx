import React, { useEffect, useState } from 'react'
import requester from '@helpers/requester'
import { Card } from 'antd'

export default () => {
  const [modules, setModules] = useState([])

  useEffect(() => {
    requester.get('modules').then(modules => {
      console.log(modules)
      setModules(modules)
    })
  }, [])

  return (
    <div>
      {modules.map((module, i) => (
        <Card key={i}>{module.name}</Card>
      ))}
    </div>
  )
}
