'use strict'

const { test } = require('tap')
const build = require('../helper')

test('API: default root route', t => {
  t.plan(3)

  const fastify = build(t)

  fastify.inject(
    {
      url: '/api/'
    },
    (err, res) => {
      t.error(err)
      t.deepEqual(res.statusCode, 200)
      t.deepEqual(res.body, 'Welcome to Oddity API')
    }
  )
})

test('REACT: default root route', t => {
  t.plan(3)

  const fastify = build(t)

  fastify.inject(
    {
      url: '/'
    },
    (err, res) => {
      t.error(err)
      t.deepEqual(res.statusCode, 200)
      t.deepEqual(res.headers['content-type'], 'text/html; charset=UTF-8')
    }
  )
})
