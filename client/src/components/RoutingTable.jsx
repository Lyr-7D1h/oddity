import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import EditableTable from './EditableTable'
import requester from '../helpers/requester'
import notificationHandler from '../helpers/notificationHandler'

const RoutingTable = ({ configId, modules }) => {
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
      required: false
    },
    {
      title: 'Module',
      dataIndex: 'moduleId',
      dataType: modules.map(mod => ({ name: mod.name, value: mod.id })),
      required: true
    },
    {
      title: 'Is Home',
      dataIndex: 'default',
      dataType: 'bool'
    }
  ]
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
    items.map(item => (item.configId = configId))

    console.log(items)

    requester
      .patch(`configs/${configId}/routes`, items)
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

export default connect(state => ({
  configId: state.config.id,
  modules: state.modules
}))(RoutingTable)
