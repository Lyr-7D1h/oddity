import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import EditableTable from './EditableTable'
import requester from '../helpers/requester'
import notificationHandler from '../helpers/notificationHandler'

import { Switch } from 'antd'

const columns = [
  {
    title: 'Title',
    dataIndex: 'name',
    dataType: 'text',
    required: true
  },
  {
    title: 'Path',
    dataIndex: 'path',
    dataType: 'text',
    required: true,
    render: route => '/' + route
  },
  {
    title: 'Module',
    dataIndex: 'module',
    dataType: ['forum', 'servers', 'members', 'home'],
    required: true
  },
  {
    title: 'Is Home',
    dataIndex: 'default',
    dataType: 'bool',
    render: isDefault => <Switch checked={isDefault} disabled></Switch>
  },
  {
    title: 'Config ID',
    dataIndex: 'configId',
    render: () => <></>
  }
]

const RoutingTable = ({ configId }) => {
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    requester
      .get(`configs/${configId}/routes`)
      .then(routes => {
        setRoutes(routes)
      })
      .catch(err => {
        notificationHandler.error('Could not fetch routes', err.message)
      })
  }, [configId])

  const handleSave = items => {
    requester
      .put(`configs/${configId}/routes`, items)
      .then(routes => {
        setRoutes(routes)
        notificationHandler.success(`Updated Routes`)
      })
      .catch(err => {
        notificationHandler.error('Updating failed', err.message)
      })
  }

  return (
    <EditableTable
      columns={columns}
      dataSource={routes}
      onSave={handleSave}
    ></EditableTable>
  )
}

export default connect(state => ({ configId: state.config.id }))(RoutingTable)
