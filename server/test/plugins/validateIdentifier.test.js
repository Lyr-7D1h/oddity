'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const validate = require('../../plugins/decorators/validateIdentifier')

const truthyIds = [
  'four',
  'test',
  'test2',
  'test_with_underscores',
  'asdf_123_dsaf_000',
  'askldfja_asdfmaslkd_alsdfkm',
]
const falseyIds = [
  'Test',
  'Test2',
  'TestWithCaps',
  'Test_Test2',
  'iiiii_iiiii_iiiii_iiiii_iiiii_iiiii',
  'asdf asdf',
  'this_is_test ',
  'with_symbol!',
  '?wow',
  '22',
  'ϠϡϢ', // Utf-8 only
  '€‹pŒ', // Extended Ascii
  null,
  undefined,
]

test('Validate Identifier: Ids should be truthful', (t) => {
  t.plan(truthyIds.length + 1)
  const fastify = Fastify()
  fastify.register(validate)

  fastify.ready((err) => {
    t.error(err)

    truthyIds.forEach((id) => {
      t.ok(fastify.validateIdentifier(id))
    })
  })
})
test('Validate Identifier: Ids should be untruthful', (t) => {
  t.plan(falseyIds.length + 1)
  const fastify = Fastify()
  fastify.register(validate)

  fastify.ready((err) => {
    t.error(err)

    falseyIds.forEach((id) => {
      t.notOk(fastify.validateIdentifier(id))
    })
  })
})
