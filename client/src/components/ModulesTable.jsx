import React, { useEffect, useState } from 'react'
import requester from '@helpers/requester'
import notificationHandler from '@helpers/notificationHandler'
import { Table, Tag, Button } from 'antd'
import { RollbackOutlined } from '@ant-design/icons'

import moduleLoaderImports from '../../module_loader_imports'

export default () => {
  const [modules, setModules] = useState([])
  const [SettingsComponent, setSettingsComponent] = useState(null)

  useEffect(() => {
    requester.get('modules').then(modules => {
      modules
        .sort((a, b) => (a.enabled ? 1 : -1))
        .map(mod => {
          mod.adminPage = moduleLoaderImports.modules[mod.name].adminPage
          return mod
        })
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
        if (enabled && record.adminPage) {
          return (
            <Button
              onClick={() =>
                setSettingsComponent(React.createElement(record.adminPage))
              }
            >
              Settings
            </Button>
          )
        }
      }
    }
  ]

  return (
    <div>
      {SettingsComponent ? (
        <>
          <Button
            style={{
              float: 'left',
              width: '25%',
              marginBottom: '10px',
              marginRight: '10px'
            }}
            type="primary"
            onClick={() => setSettingsComponent(null)}
          >
            <RollbackOutlined />
            Back
          </Button>
          {SettingsComponent}
        </>
      ) : (
        <Table
          pagination={false}
          showHeader={false}
          loading={modules.length === 0}
          columns={columns}
          rowKey="id"
          dataSource={modules}
        />
      )}
    </div>
  )
}
