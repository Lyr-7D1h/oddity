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
    editable: true,
    required: true
  },
  {
    title: 'Path',
    dataIndex: 'path',
    dataType: 'text',
    editable: true,
    required: true,
    render: route => '/' + route
  },
  {
    title: 'Module',
    dataIndex: 'module',
    dataType: ['forum', 'servers', 'members', 'home'],
    required: true,
    editable: true
  },
  {
    title: 'Is Home',
    dataIndex: 'default',
    dataType: 'bool',
    editable: true,
    required: true,
    render: isDefault => <Switch checked={isDefault} disabled></Switch>
  }
]

const RoutingTable = ({ config, updateConfig }) => {
  const handleSave = items => {
    requester
      .post(`configs/${config._id}/routes`, items)
      .then(routes => {
        const newConfig = { ...config }

        newConfig.routes = routes

        updateConfig(newConfig)
        notificationHandler.success(`Updated Routes`)
      })
      .catch(err => {
        notificationHandler.error('Updating failed', err.message)
      })
  }

  return (
    <EditableTable
      columns={columns}
      dataSource={config.routes}
      onSave={handleSave}
    ></EditableTable>
  )
}

export default connect(state => ({ config: state.config }), {
  updateConfig
})(RoutingTable)
