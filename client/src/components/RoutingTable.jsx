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
    dataType: ['forum', 'servers'],
    editable: true
  }
]

const RoutingTable = ({ config, updateConfig }) => {
  const handleSave = (key, rowItem) => {
    const data = config
    data.modules = config.modules.map(mod => {
      if (mod._id === key) {
        rowItem._id = key
        return rowItem
      }
      return mod
    })

    requester
      .put(`config/${config._id}`, data)
      .then(() => {
        updateConfig(data)
        notificationHandler.success(`Updated Route ${rowItem.name}`)
      })
      .catch(err => notificationHandler.error('Updating failed', err.message))
  }

  return (
    <EditableTable
      columns={columns}
      dataSource={config.modules}
      onSave={handleSave}
    ></EditableTable>
  )
}
export default connect(state => ({ config: state.config }), { updateConfig })(
  RoutingTable
)
