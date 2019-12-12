import React from 'react'
import { Card } from 'antd'

export default ({ message, children }) => {
  return <Card className="oddity-notification">{children}</Card>
}
