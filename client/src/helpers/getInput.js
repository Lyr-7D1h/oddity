import React from 'react'
import { Input, Switch, Select, InputNumber } from 'antd'

export default (dataType, placeHolder) => {
  dataType = dataType || 'string'
  if (placeHolder) placeHolder = placeHolder.charAt(0) + placeHolder.slice(1)

  if (dataType === 'hidden') {
    return <Input placeholder={placeHolder} hidden />
  } else if (dataType === 'string') {
    return <Input placeholder={placeHolder} />
  } else if (dataType === 'number') {
    return <InputNumber />
  } else if (dataType === 'boolean') {
    return <Switch />
  } else if (Array.isArray(dataType)) {
    return (
      <Select style={{ width: 120 }}>
        {dataType.map((dt, i) => {
          const value = dt.value ? dt.value : dt
          const name = dt.name ? dt.name : dt
          return (
            <Select.Option key={i} value={value}>
              {name}
            </Select.Option>
          )
        })}
      </Select>
    )
  } else {
    console.error('Invalid DataType')
  }
}
