import React, { useEffect, useState } from 'react'
import requester from 'Helpers/requester'
import { Table, Tag, Button } from 'antd'

import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { disableModule, enableModule } from 'Actions/initActions'
import errorHandler from 'Helpers/errorHandler'

export default ({ modules: modulesProp }) => {
  const [modules, setModules] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    setModules(modulesProp)
  }, [modulesProp])

  const setEnabled = (id) => {
    const selectedModule = modules.find((mod) => mod.id === id)
    requester
      .patch(`modules/${id}/enabled`, { enabled: !selectedModule.enabled })
      .then(() => {
        const newModules = modules.map((mod) => {
          if (mod.id === id) {
            mod.enabled = !selectedModule.enabled
          }
          return mod
        })
        setModules(newModules)

        // selectedModule.enabled = !selectedModule.enabled
        if (selectedModule.enabled) {
          dispatch(enableModule(selectedModule))
        } else {
          dispatch(disableModule(selectedModule))
        }
      })
      .catch((err) => errorHandler(err, { title: 'Could not enable module' }))
  }

  const location = useLocation()

  const columns = [
    {
      dataIndex: 'name',
      render: (name, record) => (
        <>
          {name}
          {record.route === '' ? (
            <Tag style={{ marginLeft: '15px' }} color="default">
              Home
            </Tag>
          ) : (
            ''
          )}
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
            <Link to={location.pathname + '/' + record.name.toLowerCase()}>
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
