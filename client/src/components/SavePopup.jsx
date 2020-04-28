import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Spin } from 'antd'
import { connect } from 'react-redux'
import { onSave, onReset } from 'Actions/saveActions'
import { LoadingOutlined } from '@ant-design/icons'

/**
 * Make sure to only implement this once!
 * preferably on highest level / Page level
 */
export default connect(
  (state) => ({
    saveAttempt: state.save.saveAttempt,
    show: state.save.saveAttempt !== null,
    escape: state.save.escapeAttempt,
    errors: state.save.errors,
  }),
  {
    onSave,
    onReset,
  }
)(({ onSave, onReset, show, escape, errors, saveAttempt }) => {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (errors.length > 0) {
      setIsLoading(false)
    }
    // reset when it needs to be shown
    if (!show) {
      setIsLoading(false)
    }
  }, [show, errors])

  const handleOnSave = () => {
    setIsLoading(true)
    onSave()
  }

  const handleOnReset = () => {
    onReset()
  }

  if (show) {
    return (
      <div
        className={`oddity-notification ${
          escape || errors.length > 0 ? 'error' : ''
        }`}
      >
        <Row type="flex" style={{ alignItems: 'center' }}>
          <Col span={14}>
            {isLoading ? (
              <b>
                <Spin
                  style={{ marginRight: '15px' }}
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 24, color: 'white' }}
                      spin
                    />
                  }
                />
                Saving...
              </b>
            ) : errors.length > 0 ? (
              <b>Something went wrong!</b>
            ) : (
              <b>You have unsaved changes!</b>
            )}
          </Col>

          <Col span={4}>
            <Button type="link" onClick={handleOnReset} block>
              Reset
            </Button>
          </Col>
          <Col span={6}>
            {errors.length > 0 ? (
              <Button onClick={handleOnSave} block>
                Retry
              </Button>
            ) : (
              <Button type="inverse" onClick={handleOnSave} block>
                Save Changes
              </Button>
            )}
          </Col>
        </Row>
      </div>
    )
  } else {
    return ''
  }
})
