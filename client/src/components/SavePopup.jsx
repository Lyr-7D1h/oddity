import React from 'react'
import { Button, Row, Col } from 'antd'
import { connect } from 'react-redux'

/**
 * Make sure to only implement this once!
 * preferably on highest level / Page level
 */
export default connect(
  (state) => ({ show: state.save.showSavePopup }),
  {}
)(({ onSave, isInvalid, onReset, show }) => {
  if (show) {
    return (
      <div className="oddity-notification">
        <Row type="flex" style={{ alignItems: 'center' }}>
          <Col span={14}>
            <b>You have unsaved changes!</b>
          </Col>

          <Col span={4}>
            <Button type="link" disabled={isInvalid} onClick={onReset} block>
              Reset
            </Button>
          </Col>
          <Col span={6}>
            <Button type="primary" disabled={isInvalid} onClick={onSave} block>
              Save Changes
            </Button>
          </Col>
        </Row>
      </div>
    )
  } else {
    return ''
  }
})
