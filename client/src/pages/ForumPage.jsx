import React from 'react'
import Page from '../containers/Page'
import Breadcrumb from '../components/Breadcrumb'
import Category from '../forum_components/Category'
import { Card } from 'antd'
import { connect } from 'react-redux'
import Thread from '../forum_components/Thread'
import Post from '../forum_components/Post'

export default connect(state => ({ path: state.page.selected }))(
  ({ path, category, thread, post }) => {
    const routes = [
      {
        path: ``,
        breadcrumbName: 'home'
      }
    ]

    thread &&
      routes.push({
        path: `${path[0]}/${category}/${thread}`,
        breadcrumbName: thread
      })
    post &&
      routes.push({
        path: `${path[0]}/${thread}/${post}`,
        breadcrumbName: post
      })

    const categoryItems = [
      {
        title: 'category1',
        items: [
          {
            title: 'Item1',
            description: 'Description1',
            lastArticle: {
              date: new Date(),
              author: {
                username: 'Lyr',
                identifier: 'lyr'
              },
              title: 'The almighty Exsite'
            }
          },
          { title: 'Item2', description: 'Description2' }
        ]
      },
      {
        title: 'category2',
        items: [
          { title: 'Item1', description: 'Description1' },
          { title: 'Item2', description: 'Description2' }
        ]
      }
    ]

    let Content
    if (thread && post) {
      Content = <Post />
    } else if (thread) {
      Content = <Thread />
    } else {
      Content = categoryItems.map((item, i) => (
        <Category key={i} title={item.title} items={item.items} />
      ))
    }

    return (
      <Page>
        <div style={{ paddingLeft: '10vw', paddingRight: '10vw' }}>
          <Card bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}>
            <Breadcrumb routes={routes} />
          </Card>
          <div style={{ paddingLeft: '10vw', paddingRight: '10vw' }}>
            {Content}
          </div>
        </div>
      </Page>
    )
  }
)
