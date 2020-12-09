import React, { useEffect } from 'react'
import { Result } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInit } from './initSlice'

const InitLoader = ({ children }) => {
  const dispatch = useDispatch()
  const init = useSelector((state) => state.init)

  useEffect(() => {
    dispatch(fetchInit())
  }, [dispatch])

  if (init.status === 'failed') {
    return (
      <Result
        status="warning"
        title="Could not load initial data"
        subTitle="Something went wrong: please report this incident"
      />
    )
  } else if (init.status === 'idle' && init.config) {
    document.title = init.config.title
    return children
  } else {
    return ''
  }
}

export default InitLoader
