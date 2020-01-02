import React from 'react'
import { Card } from 'antd'
import { useEffect } from 'react'
import requester from '../../helpers/requester'
import { useState } from 'react'
import NotFoundPage from '../pages/NotFoundPage'

export default ({ postId }) => {
  const [post, setPost] = useState({})

  useEffect(() => {
    requester.get(`posts/${postId}`).then(post => {
      setPost(post)
    })
  })

  return <Card>{post ? <p>{post.title}</p> : <NotFoundPage />}</Card>
}
