import React, { useEffect, useState } from 'react'
import requester from 'Helpers/requester'
import notificationHandler from 'Helpers/notificationHandler'
import { Table, Tag, Button } from 'antd'

import { Link, useLocation } from 'react-router-dom'

export default ({ modules: modulesProp }) => {
  const [modules, setModules] = useState([])

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

  const location = useLocation()

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
            <Link to={location.pathname + '/' + record.title.toLowerCase()}>
              <Button block>Settings</Button>
            </Link>
          )
        }
      },
    },
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
