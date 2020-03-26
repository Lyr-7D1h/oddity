import React from 'react'
import { Card, Button } from 'antd'

export default ({ onSave, isInvalid }) => {
  return (
    <Card className="oddity-notification">
      <div>
        <div style={{ marginBottom: 15 }}>You have unsaved changes</div>

        <Button disabled={isInvalid} type="oddity" onClick={onSave} block>
          Save Changes
        </Button>
      </div>
    </Card>
  )
}
