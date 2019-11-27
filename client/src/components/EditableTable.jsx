import React, { useState } from 'react'
import { Table, Input, InputNumber, Form, Button, Select } from 'antd'

const EditableContext = React.createContext()

class EditableCell extends React.Component {
  getInput = () => {
    const dataType = this.props.dataType || 'text'
    if (dataType === 'text') {
      return <Input />
    } else if (dataType === 'number') {
      return <InputNumber />
    } else if (Array.isArray(dataType)) {
      return (
        <Select>
          {dataType.map((dt, i) => (
            <Select.Option key={i} value={dt}>
              {dt}
            </Select.Option>
          ))}
        </Select>
      )
    } else {
      console.error('Invalid DataType')
    }
  }

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      dataType,
      record,
      index,
      children,
      ...restProps
    } = this.props

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}`
                }
              ],
              initialValue: record[dataIndex]
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    )
  }
}

const EditableTable = ({ rowKey, columns, dataSource, form, onSave }) => {
  rowKey = rowKey || '_id'
  const [editingKey, setEditingKey] = useState('')
  const [data, setData] = useState(dataSource)

  const isEditing = record => record[rowKey] === editingKey

  const cancel = () => {
    setEditingKey('')
  }

  const save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return
      }
      const newData = [...data]

      const item = row
      item._id = key

      const index = newData.findIndex(item => item[rowKey] === key)

      newData.splice(index, 1, {
        ...item,
        ...row
      })

      onSave(key, item)
      setData(newData)
      setEditingKey('')
    })
  }

  const edit = key => {
    setEditingKey(key)
  }

  //#region Add Operations to columns
  const operations = {
    title: 'operation',
    dataIndex: 'operation',
    render: (text, record) => {
      const editable = isEditing(record)
      return editable ? (
        <span>
          <EditableContext.Consumer>
            {form => (
              <Button
                onClick={() => save(form, record[rowKey])}
                style={{ marginRight: 8 }}
              >
                Save
              </Button>
            )}
          </EditableContext.Consumer>

          <Button onClick={() => cancel(record[rowKey])}>Cancel</Button>
        </span>
      ) : (
        <Button
          disabled={editingKey !== ''}
          onClick={() => edit(record[rowKey])}
        >
          Edit
        </Button>
      )
    }
  }
  const columnsWithOperations = columns.concat([operations])

  const editableColumns = columnsWithOperations.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: record => {
        return {
          record,
          dataType: col.dataType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record)
        }
      }
    }
  })
  //#endregion

  const components = {
    body: {
      cell: EditableCell
    }
  }

  return (
    <EditableContext.Provider value={form}>
      <Table
        rowKey={rowKey}
        components={components}
        dataSource={data}
        columns={editableColumns}
        pagination={{
          onChange: cancel
        }}
      />
    </EditableContext.Provider>
  )
}

const EditableFormTable = Form.create()(EditableTable)
export default EditableFormTable
