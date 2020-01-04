import React, { useEffect, useState } from 'react'
import Page from '../containers/Page'
import Breadcrumb from '../Breadcrumb'
import Category from '../forum/Category'
import { Card } from 'antd'
import { connect } from 'react-redux'
import Thread from '../forum/Thread'
import Post from '../forum/Post'
import requester from '../../helpers/requester'
import notificationHandler from '../../helpers/notificationHandler'
import CreatePostForm from '../forum/CreatePostForm'

/**
 * ForumPage
 * @param {string} post - Either title of post or action ("create")
 */
export default connect(state => ({ path: state.page.selected }))(
  ({ path, category, thread, post }) => {
    const [forumItems, setForumItems] = useState([])
    const routes = [
      {
        path: `/${path[0]}`,
        breadcrumbName: 'home'
      }
    ]

    category &&
      routes.push({
        path: `/${path[0]}/${category}`,
        breadcrumbName: category
      })
    thread &&
      routes.push({
        path: `/${path[0]}/${category}/${thread}`,
        breadcrumbName: thread
      })
    post &&
      routes.push({
        path: `/${path[0]}/${thread}/${post}`,
        breadcrumbName: post
      })

    const currentPath = routes[routes.length - 1].path

    useEffect(() => {
      requester
        .get('forum')
        .then(forum => {
          forum = forum.filter(
            item =>
              !(item.title === 'Uncategorized' && item.threads.length === 0)
          )
          setForumItems(forum)
        })
        .catch(err => {
          notificationHandler.error('Could not fetch forum data')
        })

      if (category) {
        let findUrl = `/${category}`
        if (thread) findUrl += `/${thread}`
        if (post) findUrl += `/${post}`

        requester
          .get(`forum/find${findUrl}`)
          .then(id => {
            console.log(id)
          })
          .catch(err => {
            notificationHandler.error('Current page not found')
          })
      }
    }, [])

    let Content
    if (category && thread && post) {
      if (post === 'create') {
        let threadId
        forumItems.forEach(categoryItem => {
          if (categoryItem.title === category) {
            categoryItem.threads.forEach(threadItem => {
              if (threadItem.title === thread) {
                threadId = threadItem.id
              }
            })
          }
        })
        Content = (
          <CreatePostForm currentPath={currentPath} threadId={threadId} />
        )
      } else {
        // let postId = null
        forumItems.forEach(categoryItem => {
          if (categoryItem.title === category) {
            categoryItem.threads.forEach(threadItem => {
              if (threadItem.title === thread) {
                // get postid
              }
            })
          }
        })
        Content = <Post currentPath={currentPath} />
      }
    } else if (category && thread) {
      let threadId
      forumItems.forEach(categoryItem => {
        if (categoryItem.title === category) {
          categoryItem.threads.forEach(threadItem => {
            if (threadItem.title === thread) {
              threadId = threadItem.id
            }
          })
        }
      })
      if (!threadId) {
        Content = <Card>Could not find thread</Card>
      } else {
        Content = <Thread currentPath={currentPath} threadId={threadId} />
      }
    } else if (category) {
      // TODO: only get for this category url
      const currentCategory = forumItems.find(item => item.title === category)
      if (currentCategory) {
        Content = (
          <Category
            currentPath={currentPath}
            title={currentCategory.title}
            threads={currentCategory.threads}
          />
        )
      } else {
        Content = <Card>Could not find category</Card>
      }
    } else {
      Content = forumItems.map((item, i) => (
        <Category
          key={i}
          currentPath={currentPath + '/' + item.title}
          title={item.title}
          threads={item.threads}
        />
      ))
    }

    return (
      <Page>
        <div style={{ paddingLeft: '10vw', paddingRight: '10vw' }}>
          <Card bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}>
            <Breadcrumb routes={routes} />
          </Card>
          <div style={{ paddingLeft: '10vw', paddingRight: '10vw' }}>
            {forumItems.length > 0 && Content}
          </div>
        </div>
      </Page>
    )
  }
)
