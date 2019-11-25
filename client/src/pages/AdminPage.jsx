import React from 'react'
import Page from '../containers/Page'
import { connect } from 'react-redux'
import { Table, Button } from 'antd'

const columns = [
  {
    title: 'Title',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Route',
    dataIndex: 'route',
    key: 'route'
  },
  {
    title: 'Actions',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => (
      <>
        <Button>Delete</Button>
      </>
    )
  }
]

const AdminPage = ({ config }) => {
  console.log(config.nav)
  return (
    <Page selected="admin">
      <Table rowKey="_id" columns={columns} dataSource={config.nav}></Table>
    </Page>
  )
}

export default connect(state => ({ config: state.config }))(AdminPage)
