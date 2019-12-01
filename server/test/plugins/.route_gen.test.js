'use strict'

const Fastify = require('fastify')
const { test } = require('tap')
const { build } = require('../helper')
const RouteGen = require('../../plugins/route_gen')
const { buildModel } = require('../mongooseHelper')

const buildApp = () => {
  const app = new Fastify()

  app.register(RouteGen)

  return app
}

test('Empty call returns error', t => {
  t.plan(2)

  const app = buildApp()

  t.rejects(app.routeGen())

  app.ready(err => {
    t.error(err)
  })
})

test('POST works as expected', t => {
  t.plan(4)

  const app = buildApp(t)

  const routeOpts = {
    model: buildModel(null, app),
    routes: [
      {
        method: 'post'
      }
    ]
  }

  const checkRoute = () => {
    app.inject(
      {
        url: '/api/tests'
      },
      (err, res) => {
        t.error(err)
        console.log(res)
      }
    )
  }

  app
    .routeGen(routeOpts)
    .then(() => checkRoute())
    .catch(err => {
      t.error(err)
    })

  app.ready(err => {
    t.error(err)
  })
})
