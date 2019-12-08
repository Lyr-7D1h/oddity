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
    title: 'Route',
    dataIndex: 'route',
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
  const handleSave = item => {
    const data = config
    data.routes = config.routes.map(mod => {
      if (mod._id === item._id) {
        return item
      }
      return mod
    })

    requester
      .put(`configs/${config._id}/routes`, item)
      .then(() => {
        updateConfig(data)
        notificationHandler.success(`Updated Route ${item.name}`)
      })
      .catch(err => notificationHandler.error('Updating failed', err))
  }

  const handleDelete = id => {
    const data = config
    // Remove item from data
    const item = data.routes.find(mod => mod._id === id)
    data.routes = data.routes.filter(mod => mod._id !== id)

    requester
      .put(`configs/${config._id}/routes`, item)
      .then(() => {
        updateConfig(data)
        notificationHandler.success(`Removed Route ${item.name}`)
      })
      .catch(err => notificationHandler.error('Deleting failed', err))
  }

  const handleCreate = item => {
    const data = config
    data.routes.push(item)

    console.log(item)

    requester
      .put(`configs/${config._id}/routes`, item)
      .then(res => {
        item._id = res._id
        const data = config
        data.routes.push(item)

        updateConfig(data)
        notificationHandler.success(`Created Route ${item.name}`)
      })
      .catch(err => {
        notificationHandler.error('Creating failed', err)
      })
  }

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
export default connect(state => ({ config: state.config }), { updateConfig })(
  RoutingTable
)
