import React, { useEffect, useState } from 'react'
import requester from '@helpers/requester'
import notificationHandler from '@helpers/notificationHandler'
import { Table, Tag, Button, Input, notification } from 'antd'
import { RollbackOutlined } from '@ant-design/icons'

import moduleLoaderImports from '../../module_loader_imports'
import { connect } from 'react-redux'
import SavePopup from './SavePopup'

export default connect(state => ({
  configId: state.config.id,
  routes: state.config.routes
}))(({ routes, configId }) => {
  const [modules, setModules] = useState([])
  const [SettingsComponent, setSettingsComponent] = useState(null)
  const [changesMade, setChangesMade] = useState(false)

  useEffect(() => {
    requester.get('modules').then(modules => {
      modules
        .sort((a, b) => (a.enabled ? 1 : -1))
        .map(mod => {
          mod.adminPage = moduleLoaderImports.modules[mod.name].adminPage
          mod.route = routes.find(route => route.moduleId === mod.id) || {
            path: ''
          }
          return mod
        })
      setModules(modules.sort((a, b) => (a === b ? 0 : a ? -1 : 1))) // sets enabled first
    })
  }, [routes])

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

  const validateData = () => {
    const errors = []

    const occurances = {}
    let hasOccurances = false
    let defaultPath = 0
    modules.forEach(mod => {
      if (mod.enabled) {
        if (occurances[mod.route.path] === true) {
          hasOccurances = true
        } else {
          occurances[mod.route.path] = true
        }
        if (mod.route.path === '') {
          defaultPath++
        } else if (
          mod.route.path.startsWith('/') ||
          mod.route.path.endsWith('/')
        ) {
          errors.push("Format of path is invalid: don't include /")
        }
        occurances[mod] = true
      }
    })
    console.log(occurances)
    if (hasOccurances) {
      errors.push('You can not have duplicate routes')
    }

    if (defaultPath !== 1) {
      errors.push('There should only be one default path: an empty path')
    }

    return errors
  }

  const routeChangeHandler = (id, value) => {
    setModules(
      modules.map(mod => {
        if (mod.id === id) mod.route.path = value
        return mod
      })
    )
    setChangesMade(true)
  }

  const handleSave = () => {
    const errors = validateData()
    if (errors.length > 0) {
      errors.forEach(error => {
        notification['error']({
          message: error,
          duration: 10
        })
      })
    } else {
      requester
        .patch(
          `configs/${configId}/routes`,
          modules
            .filter(mod => mod.enabled)
            .map(mod => ({
              id: mod.route.id,
              path: mod.route.path || '',
              moduleId: mod.id,
              configId: configId,
              isActive: true,
              default: mod.route.path === '' || mod.route.path === undefined
            }))
        )
        .then(routes => {
          setModules(
            modules.map(mod => {
              const moduleRoute = routes.find(
                route => route.moduleId === mod.id
              )
              if (moduleRoute) mod.route = moduleRoute
              return mod
            })
          )
          setChangesMade(false)
        })
        .catch(err => {
          console.error(err)
          notificationHandler.error('Could not update routes', err.message)
        })
    }
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
      dataIndex: 'route',
      render: (route, record) => {
        if (record.enabled) {
          if (route && route.noRoute) {
            return
          }
          return (
            <Input
              type="text"
              prefix="/"
              placeholder="baseroute"
              onChange={e => routeChangeHandler(record.id, e.target.value)}
              value={route ? route.path : ''}
            />
          )
        }
      }
    },
    {
      dataIndex: 'enabled',
      render: (enabled, record) => {
        if (enabled && record.adminPage) {
          return (
            <>
              <Button
                onClick={() =>
                  setSettingsComponent(React.createElement(record.adminPage))
                }
              >
                Settings
              </Button>
            </>
          )
        }
      }
    }
  ]

  return (
    <div>
      {changesMade ? <SavePopup onSave={handleSave} /> : ''}
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
})
