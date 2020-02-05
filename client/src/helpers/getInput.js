import React from 'react'
import { Input, Switch, Select, InputNumber } from 'antd'

export default (dataType, placeHolder) => {
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
