import React, { useState, useEffect } from 'react'
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
import ActionPopup from './ActionPopup'

const EditableContext = React.createContext()

const getInput = (dataType, placeHolder) => {
  dataType = dataType || 'text'
  if (dataType === 'hidden') {
    return <Input placeholder={placeHolder} hidden />
  } else if (dataType === 'text') {
    return <Input placeholder={placeHolder} />
  } else if (dataType === 'number') {
    return <InputNumber />
  } else if (dataType === 'bool') {
    return <Switch />
  } else if (Array.isArray(dataType)) {
    return (
      <Select style={{ width: 120 }}>
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
      onChange,
      dataIndex,
      rowKey,
      title,
      dataType,
      required,
      record,
      index,
      children,
      ...restProps
    } = this.props

    if (dataIndex === 'operation') {
      return <td {...restProps}> {children}</td>
    }

    if (dataType === 'bool' && required) {
      console.error('Boolean datatypes can not be required')
    }

    return (
      <td {...restProps}>
        <Form.Item style={{ margin: 0 }}>
          {getFieldDecorator(`${record[rowKey]}___${dataIndex}`, {
            getValueFromEvent: onChange,
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
const EditableTable = ({ rowKey, columns, dataSource, form, onSave }) => {
  rowKey = rowKey || 'id' // sets id by default if nothing else specified
  const [data, setData] = useState(dataSource)
  const [hasChanges, setHasChanges] = useState(false)

  // make sure you can load when data is async
  useEffect(() => {
    // if no changes and data is different then source set data
    if (!hasChanges && dataSource !== data) {
      setData(dataSource)
    }
  }, [hasChanges, dataSource, data])

  const create = form => {
    form.validateFields((error, row) => {
      if (error) {
        return
      }
      row[rowKey] = 'created' + (data.length + 1)

      if (!hasChanges) {
        setHasChanges(true)
      }
      setData(data.concat([row]))
    })
  }

  const del = (form, key) => {
    let newData = [].concat(data)
    newData = newData.filter(item => item[rowKey] !== key)
    setHasChanges(true)
    setData(newData)
  }

  const handleOnChange = event => {
    setHasChanges(true)
    let value
    // checkbox and option gives different event
    if (event !== null) {
      if (!event.target) {
        value = event
      } else {
        value = event.target.value
      }
    }
    return value
  }

  const save = () => {
    form.validateFields((error, row) => {
      if (error) {
        return
      }

      const result = []
      let obj = {}
      Object.keys(row).forEach(key => {
        const split = key.split('___')
        const field = split[1]
        const id = split[0]

        // set id if does not exsist
        if (!obj[rowKey]) {
          obj[rowKey] = id
        } else {
          // is object from different item?
          if (obj[rowKey] !== id) {
            // remove created id
            if (obj[rowKey].includes('created')) {
              delete obj[rowKey]
            }
            result.push(obj)

            // start new object
            obj = {}
            obj[rowKey] = id
          }
        }

        obj[field] = row[key]
      })
      // remove created id
      if (obj[rowKey].includes('created')) {
        delete obj[rowKey]
      }
      // push last obj
      result.push(obj)

      setHasChanges(false)

      onSave(result)
    })
  }

  const operations = {
    title: 'Operation',
    dataIndex: 'operation',
    render: (text, record) => (
      <Row>
        <Col>
          <EditableContext.Consumer>
            {form => (
              <Button
                type="danger"
                block
                onClick={() => del(form, record[rowKey])}
              >
                Delete
              </Button>
            )}
          </EditableContext.Consumer>
        </Col>
      </Row>
    )
  }

  const columnsWithOperations = columns.concat([operations])

  const editableColumns = columnsWithOperations.map(col => {
    return {
      ...col,
      onCell: record => {
        return {
          rowKey,
          onChange: handleOnChange,
          record,
          dataType: col.dataType,
          dataIndex: col.dataIndex,
          required: col.required,
          title: col.title
        }
      }
    }
  })

  const components = {
    body: {
      cell: EditableCell
    }
  }

  const CreateForm = Form.create()(({ form }) => {
    // const colSize = Math.floor(24 / (editableColumns.length + 1))
    return (
      <Form>
        <Row gutter={16} type="flex">
          {editableColumns.map((col, i) => {
            if (col.dataIndex === 'operation') {
              return ''
            }
            return (
              <Col key={i}>
                <Form.Item style={{ margin: 0 }}>
                  {form.getFieldDecorator(col.dataIndex, {
                    rules: [
                      {
                        required: col.required,
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
          })}
          <Col>
            <Button onClick={() => create(form)} block>
              Create
            </Button>
          </Col>
        </Row>
      </Form>
    )
  })

  return (
    <EditableContext.Provider value={form}>
      {hasChanges && (
        <ActionPopup>
          <div>
            <div style={{ marginBottom: 15 }}>You have unsaved changes</div>

            <Button type="oddity" onClick={save} block>
              Save Changes
            </Button>
          </div>
        </ActionPopup>
      )}

      <Table
        rowKey={rowKey}
        components={components}
        dataSource={data}
        columns={editableColumns}
        pagination={false}
        rowClassName="oddity-row"
        footer={() => <CreateForm />}
      />
    </EditableContext.Provider>
  )
}

const EditableFormTable = Form.create()(EditableTable)
export default EditableFormTable
