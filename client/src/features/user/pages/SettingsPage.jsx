import React from 'react'
import ConditionalRedirect from '../../common/containers/ConditionalRedirect'
import Page from '../../common/containers/Page'
import { Card, Layout, Divider } from 'antd'
import { connect } from 'react-redux'
import VertNav from 'Features/common/VertNav'
import { UserOutlined, LockOutlined, LinkOutlined } from '@ant-design/icons'
import Centered from '../../common/containers/Centered'
import Title from 'antd/lib/typography/Title'

export default connect((state) => ({ username: state.user.username }))(
  ({ username, children, title }) => {
    const navItems = [
      {
        title: 'Account',
        route: '/settings',
        icon: <UserOutlined />,
      },
      {
        title: 'Security',
        route: '/settings/security',
        icon: <LockOutlined />,
      },
      {
        title: 'Linked Accounts',
        route: '/settings/linked',
        icon: <LinkOutlined />,
      },
    ]

    return (
      <ConditionalRedirect condition={!username}>
        <Page>
          <Centered>
            <Layout>
              <Layout.Sider width={200} className="component-background">
                <VertNav items={navItems} />
              </Layout.Sider>
              <Layout>
                <Card>
                  {title ? (
                    <>
                      <Title level={2}>{title}</Title>
                      <Divider />
                    </>
                  ) : (
                    ''
                  )}
                  {children}
                </Card>
              </Layout>
            </Layout>
          </Centered>
        </Page>
      </ConditionalRedirect>
    )
  }
)
