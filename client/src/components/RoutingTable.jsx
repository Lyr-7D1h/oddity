import React from 'react'
import { connect } from 'react-redux'
import EditableTable from './EditableTable'
import requester from '../helpers/requester'
import notificationHandler from '../helpers/notificationHandler'

import { updateConfig } from '../redux/actions/configActions'
import { Switch } from 'antd'

const columns = [
  {
    title: 'Title',
    dataIndex: 'name',
    dataType: 'text',
    editable: true
  },
  {
    title: 'Path',
    dataIndex: 'path',
    dataType: 'text',
    editable: true,
    render: route => '/' + route
  },
  {
    title: 'Module',
    dataIndex: 'module',
    dataType: ['forum', 'servers', 'members', 'home'],
    editable: true
  },
  {
    title: 'Is Home',
    dataIndex: 'default',
    dataType: 'bool',
    editable: true,
    render: isDefault => <Switch checked={isDefault} disabled></Switch>
  }
]

const RoutingTable = ({ config, updateConfig }) => {
  const handleDelete = routeId => {
    requester
      .delete(`configs/${config._id}/routes/${routeId}`)
      .then(() => {
        let item
        for (const i in config.routes) {
          const { _id } = config.routes[i]
          if (_id == routeId) {
            item = config.routes[i]
            config.routes.splice(i, 1)
          }
        }
        updateConfig(config)
        notificationHandler.success(`Removed Route ${item.name}`)
      })
      .catch(err => notificationHandler.error('Deleting failed', err.message))
  }

  const handleSave = item => {
    if (!item._id) {
      return notificationHandler.error(
        'Creating failed',
        'Item does not have an Id'
      )
    }

    requester
      .patch(`configs/${config._id}/routes/${item._id}`, item)
      .then(() => {
        config.routes.push(item)

        updateConfig(config)
        notificationHandler.success(`Updated Route ${item.name}`)
      })
      .catch(err => notificationHandler.error('Updating failed', err.message))
  }

  const handleCreate = item => {
    requester
      .post(`configs/${config._id}/routes`, item)
      .then(res => {
        item._id = res._id
        config.routes.push(item)

        updateConfig(config)
        notificationHandler.success(`Created Route ${item.name}`)
      })
      .catch(err => {
        notificationHandler.error('Creating failed', err.message)
      })
  }

  console.log('rendering routing table')

  return (
    <EditableTable
      columns={columns}
      dataSource={config.routes}
      onSave={handleSave}
      onDelete={handleDelete}
      onCreate={handleCreate}
    ></EditableTable>
  )
}
export default connect(
  state => {
    console.log(state)
    return { config: state.config }
  },
  {
    updateConfig
  }
)(RoutingTable)
