const t = require('tap')
const bcrypt = require('bcrypt')

const test = t.test

// clear all tables
require('../db.helper')()

const build = require('../helper')

const testRole = {
  name: 'Test',
  permissions: 1
}

const hash = bcrypt.hashSync('test', 12)
const testUser = {
  username: 'Test',
  identifier: 'test',
  email: 'test@test.com',
  roleId: 1,
  password: hash,
  ip: '127.0.0.1'
}

const basicTest = app => {
  app.register(async fastify => {
    fastify.get(
      '/test',
      {
        preHandler: app.auth([app.authentication.basic])
      },
      (request, reply) => {
        reply.send(request.credentials)
      }
    )
  })
}

test('Can not authorize without credentials USING BASIC', t => {
  t.plan(5)

  const app = build(t)

  basicTest(app)

  app.ready(err => {
    t.error(err)

    app.inject(
      {
        url: '/test'
      },
      (err, res) => {
        t.error(err)
        t.equal(res.statusCode, 401)

        t.deepEqual(
          res.headers['content-type'],
          'application/json; charset=utf-8'
        )

        t.deepEqual(JSON.parse(res.body), {
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Unauthorized'
        })
      }
    )
  })
})

test('Can authorize USING BASIC', t => {
  t.plan(4)

  const app = build(t)

  basicTest(app)

  app.ready(err => {
    t.error(err)

    app.models.role
      .create(testRole)
      .then(role => {
        testUser.roleId = role.id

        app.models.user
          .create(testUser)
          .then(() => {
            app.inject(
              {
                url: '/test',
                headers: {
                  Authorization:
                    'Basic ' + Buffer.from('test:test').toString('base64') // Base64 admin:admin
                }
              },
              (err, res) => {
                t.error(err)

                t.equal(res.statusCode, 200)

                t.equal(JSON.parse(res.body).id, 1)
              }
            )
          })
          .catch(err => {
            t.error(err)
          })
      })
      .catch(err => {
        t.error(err)
      })
  })
})

test('Can not authorize with wrong credentials USING BASIC', t => {
  t.plan(5)

  const app = build(t)

  basicTest(app)

  app.ready(err => {
    t.error(err)

    app.inject(
      {
        url: '/test',
        headers: {
          Authorization: 'Basic ' + Buffer.from('test:asdf').toString('base64')
        }
      },
      (err, res) => {
        t.error(err)
        t.equal(res.statusCode, 401)

        t.deepEqual(
          res.headers['content-type'],
          'application/json; charset=utf-8'
        )

        t.deepEqual(JSON.parse(res.body), {
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Unauthorized'
        })
      }
    )
  })
})
