import React from 'react'
import { connect } from 'react-redux'
import EditableTable from './EditableTable'
import requester from '../helpers/requester'
import notificationHandler from '../helpers/notificationHandler'

import { updateConfig } from '../redux/actions/configActions'

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
    dataIndex: 'config',
    dataType: ['forum', 'servers', 'members'],
    editable: true
  }
]

const RoutingTable = ({ config, updateConfig }) => {
  const handleSave = item => {
    const data = config
    data.modules = config.modules.map(mod => {
      if (mod._id === item._id) {
        return item
      }
      return mod
    })

    requester
      .put(`config/${config._id}`, data)
      .then(() => {
        updateConfig(data)
        notificationHandler.success(`Updated Route ${item.name}`)
      })
      .catch(err => notificationHandler.error('Updating failed', err.message))
  }

  const handleDelete = id => {
    const data = config
    // Remove item from data
    const item = data.modules.find(mod => mod._id === id)
    data.modules = data.modules.filter(mod => mod._id !== id)

    requester
      .put(`config/${config._id}`, data)
      .then(() => {
        updateConfig(data)
        notificationHandler.success(`Removed Route ${item.name}`)
      })
      .catch(err => notificationHandler.error('Deleting failed', err.message))
  }

  const handleCreate = item => {
    const data = config
    data.modules.push(item)

    requester
      .put(`config/${config._id}`, data)
      .then(res => {
        item._id = res._id
        const data = config
        data.modules.push(item)

        updateConfig(data)
        notificationHandler.success(`Created Route ${item.name}`)
      })
      .catch(err => notificationHandler.error('Creating failed', err.message))
  }

  return (
    <EditableTable
      columns={columns}
      dataSource={config.modules}
      onSave={handleSave}
      onDelete={handleDelete}
      onCreate={handleCreate}
    ></EditableTable>
  )
}
export default connect(state => ({ config: state.config }), { updateConfig })(
  RoutingTable
)
