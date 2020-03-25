import React, { useEffect, useState } from 'react'
import requester from '@helpers/requester'
import notificationHandler from '@helpers/notificationHandler'
import { Table, Tag, Button } from 'antd'

export default () => {
  const [modules, setModules] = useState([])

  useEffect(() => {
    requester.get('modules').then(modules => {
      setModules(modules.sort((a, b) => (a === b ? 0 : a ? -1 : 1))) // sets enabled first
    })
  }, [])

  const setEnabled = id => {
    const enabled = !modules.find(mod => mod.id === id).enabled
    requester
      .put(`modules/${id}`, { enabled })
      .then(() => {
        setModules(
          modules.map(mod => {
            if (mod.id === id) {
              mod.enabled = enabled
            }
            return mod
          })
        )
      })
      .catch(err => {
        notificationHandler.error('Could not enable Module', err.message)
      })
  }

  const columns = [
    {
      dataIndex: 'name'
    },
    {
      dataIndex: 'version'
    },
    {
      dataIndex: 'enabled',
      render: (enabled, record) =>
        enabled ? (
          <Tag
            className="clickable"
            onClick={() => setEnabled(record.id)}
            color="green"
          >
            Enabled
          </Tag>
        ) : (
          <Tag
            className="clickable"
            onClick={() => setEnabled(record.id)}
            color="red"
          >
            Disabled
          </Tag>
        )
    },
    {
      dataIndex: 'enabled',
      render: (enabled, record) => {
        if (enabled) {
          return <Button>Settings</Button>
        }
      }
    }
  ]

  return (
    <div>
      <Table
        pagination={false}
        showHeader={false}
        loading={modules.length === 0}
        columns={columns}
        rowKey="id"
        dataSource={modules}
      />
    </div>
  )
}
