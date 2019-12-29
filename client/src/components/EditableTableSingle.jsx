import React, { useState } from 'react'
import {
  Table,
  Input,
  InputNumber,
  Form,
  Button,
  Select,
  Row,
  Col,
  Switch
} from 'antd'

const EditableContext = React.createContext()

const getInput = (dataType, placeHolder) => {
  dataType = dataType || 'text'
  if (dataType === 'text') {
    return <Input placeholder={placeHolder} />
  } else if (dataType === 'number') {
    return <InputNumber />
  } else if (dataType === 'bool') {
    return <Switch />
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
class EditableCell extends React.Component {
  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      dataType,
      required,
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
                  required: required,
                  message: `Please Input ${title}`
                }
              ],
              valuePropName: dataType === 'bool' ? 'checked' : 'value',
              initialValue: record[dataIndex]
            })(getInput(dataType))}
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

/**
 *
 * @param {function} onSave - Returns item with ID
 * @param {function} onDelete - Returns item with ID
 * @param {function} onCreate - Returns item WITHOUT ID
 */
const EditableTable = ({
  rowKey,
  columns,
  dataSource,
  form,
  onSave,
  onDelete,
  onCreate
}) => {
  rowKey = rowKey || 'id' // sets id by default if nothing else specified
  const [editingKey, setEditingKey] = useState('')
  const data = dataSource

  // #region Functions
  const isEditing = record => record[rowKey] === editingKey

  const cancel = () => {
    setEditingKey('')
  }

  const del = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return
      }

      onDelete(key)
    })
  }

  const create = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return
      }

      onCreate(row)
    })
  }

  const save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return
      }

      const item = row
      item[rowKey] = key

      onSave(item)
      setEditingKey('')
    })
  }

  const edit = key => {
    setEditingKey(key)
  }
  //#endregion

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
        <Row>
          <Col span={12}>
            <Button
              block
              disabled={editingKey !== ''}
              onClick={() => edit(record[rowKey])}
            >
              Edit
            </Button>
          </Col>
          {/* Add Delete if there is a handler for it */}
          {onDelete ? (
            <Col span={12}>
              <EditableContext.Consumer>
                {form => (
                  <Button
                    type="danger"
                    block
                    disabled={editingKey !== ''}
                    onClick={() => del(form, record[rowKey])}
                  >
                    Delete
                  </Button>
                )}
              </EditableContext.Consumer>
            </Col>
          ) : (
            ''
          )}
        </Row>
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
          required: col.required,
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
  const CreateForm = Form.create()(({ form }) => {
    return (
      <Row gutter={16}>
        <Form>
          {editableColumns.map((col, i) => {
            const colSize = Math.floor(24 / editableColumns.length)
            if (col.title === 'operation') {
              return (
                <Col key={i} span={colSize}>
                  <Button onClick={() => create(form)} block>
                    Create
                  </Button>
                </Col>
              )
            } else {
              if (!col.creatable && !col.editable) {
                return ''
              }
              return (
                <Col key={i} span={colSize}>
                  <Form.Item style={{ margin: 0 }}>
                    {form.getFieldDecorator(col.dataIndex, {
                      rules: [
                        {
                          required: true,
                          message: `Please Input ${col.title}`
                        }
                      ],
                      valuePropName:
                        col.dataType === 'bool' ? 'checked' : 'value',
                      initialValue: col.dataType === 'bool' ? false : ''
                    })(getInput(col.dataType, col.title))}
                  </Form.Item>
                </Col>
              )
            }
          })}
        </Form>
      </Row>
    )
  })
  return (
    <EditableContext.Provider value={form}>
      <Table
        rowKey={rowKey}
        components={components}
        dataSource={data}
        columns={editableColumns}
        rowClassName="oddity-row"
        pagination={{
          onChange: cancel
        }}
        footer={() => <CreateForm />}
      />
    </EditableContext.Provider>
  )
}

const EditableFormTable = Form.create()(EditableTable)
export default EditableFormTable
