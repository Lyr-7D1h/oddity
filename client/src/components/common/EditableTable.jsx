// import { Table } from 'antd'
// import getInput from 'Helpers/getInput'
// import saveWrapper from 'Helpers/saveWrapper'
// import React, { useState, useEffect } from 'react'

// const getColumns = (columns) => {
//   columns.map((column) => {
//     if (column.dataType) {
//       column.render = () => getInput(column.dataType)
//     }
//     return column
//   })
// }

// const EditableTable = ({ data, columns }) => {
//   if (data.length === 0) {
//     return 'empty'
//   } else {
//     return (
//       <Table
//         pagination={false}
//         showHeader={false}
//         loading={data.length === 0}
//         columns={getColumns(data)}
//         rowKey="id"
//         dataSource={data}
//       />
//     )
//   }
// }

// export default saveWrapper(
//   EditableTable,
//   'EditableTable' + Math.random().toString(36).substring(7)
// )
