import React, { useEffect, useState } from 'react'
import requester from 'Helpers/requester'
import notificationHandler from 'Helpers/notificationHandler'
import { Table, Tag, Button } from 'antd'

import ModuleSettingsPage from './pages/ModuleSettingsPage'

export default ({ modules: modulesProp }) => {
  const [modules, setModules] = useState([])
  const [selectedModule, setSelectedModule] = useState(null)

  useEffect(() => {
    setModules(modulesProp)
  }, [modulesProp])

  const setEnabled = (id) => {
    const enabled = !modules.find((mod) => mod.id === id).enabled
    requester
      .patch(`modules/${id}/enabled`, { enabled })
      .then(() => {
        setModules(
          modules.map((mod) => {
            if (mod.id === id) {
              mod.enabled = enabled
            }
            return mod
          })
        )
      })
      .catch((err) => {
        notificationHandler.error('Could not enable Module', err.message)
      })
  }

  const columns = [
    {
      dataIndex: 'name',
      render: (name, record) => (
        <>
          {name}
          {record.route === '' ? <Tag color="green">Home</Tag> : ''}
        </>
      ),
    },
    {
      dataIndex: 'version',
    },
    {
      dataIndex: 'enabled',
      render: (enabled, record) => (
        <Button
          className="clickable"
          onClick={() => setEnabled(record.id)}
          type={enabled ? 'primary' : 'default'}
          block
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </Button>
      ),
    },
    {
      dataIndex: 'enabled',
      render: (enabled, record) => {
        if (enabled) {
          return (
            <>
              <Button onClick={() => setSelectedModule(record)} block>
                Settings
              </Button>
            </>
          )
        }
      },
    },
  ]

  return (
    <div>
      {selectedModule !== null ? (
        <ModuleSettingsPage
          onClose={() => setSelectedModule(null)}
          module={selectedModule}
        />
      ) : (
        <>
          <Table
            pagination={false}
            showHeader={false}
            loading={modules.length === 0}
            columns={columns}
            rowKey="id"
            dataSource={modules}
          />
        </>
      )}
    </div>
  )
}
