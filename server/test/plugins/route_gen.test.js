'use strict'

const Fastify = require('fastify')
const { test } = require('tap')
const RouteGen = require('../../plugins/decorators/route_generation')
// const getTestModel = require('../models/test')

// clear all tables
require('../db.helper')()

// let build = (t) => {
//   const app = require('../helper')(t)

//   app.decorate('TestModel')

//   return app
// }

test('Empty call returns error on new instance', (t) => {
  t.plan(2)

  const app = new Fastify()

  app.register(RouteGen)

  app.ready((err) => {
    t.error(err)
    t.rejects(app.routeGen())
  })
})

// only('GET works as expected', async t => {
//   t.plan(3)

//   const app = build(t)

//   app.register((fastify, _, done) => {
//     console.log(getTestModel(fastify))
//     fastify.routeGen({
//       model: getTestModel(fastify),
//       routes: [
//         {
//           method: 'get'
//         }
//       ]
//     })
//     done()
//   })

//   app.ready(err => {
//     t.error(err)

//     app.inject(
//       {
//         url: '/api/tests'
//       },
//       (err, res) => {
//         t.error(err)

//         t.equal(res.statusCode, 200)

//         t.deepEqual(
//           res.headers['content-type'],
//           'application/json; charset=utf-8'
//         )
//       }
//     )
//   })
// })

// TODO: add more tests
