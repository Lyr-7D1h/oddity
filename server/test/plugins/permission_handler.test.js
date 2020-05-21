const { test } = require('tap')
const fp = require('fastify-plugin')

const build = require('../build.helper')
const { clear } = require('../db.helper')

const password = 'this_is_an_test_pass'
const passwordHash = require('bcrypt').hashSync(password, 12)

const createTestUser = async (fastify, permission, is_for_role) => {
  clear()

  const role = await fastify.models.role.create({
    name: 'TestRole',
    permissions: is_for_role ? permission : 0,
  })
  const user = await fastify.models.user.create({
    username: 'Test',
    identifier: 'test',
    email: 'test@test.com',
    roleId: role.id,
    password: passwordHash,
    permissions: is_for_role ? 0 : permission,
    ip: '127.0.0.1',
  })
  return user
}

const authorizationHeader = {
  Authorization: 'Basic ' + Buffer.from(`test:${password}`).toString('base64'),
}

const routes = [
  '/asdf/asdf/asdf/:asdf/:asdf',
  '/asfj/:fffffSDSF/SDF',
  '/jjjJ/JJJ/*',
  '/jjjJ/JJJ/SDLFKJ',
]

const tryRoutes = [
  '/asdf/asdf/asdf/fjfj/fsk',
  'asfj/jfjfjf/SDF',
  '/jjjJ/JJJ/fjdsk',
  '/jjjJ/JJJ/',
  '/jjjJ/JJJ/SDLFKJ',
]

test('Do route variables work', (t) => {
  t.plan(1 + tryRoutes.length * 4 * 3)

  const app = build(t)

  app.register(
    fp(async (fastify) => {
      await createTestUser(fastify, 4, true)

      routes.forEach((route) => {
        fastify.get(
          route,
          {
            permissions: 4,
            preHandler: fastify.auth([fastify.authorization.basic]),
          },
          (req, reply) => {
            return reply.send({ method: 'GET' })
          }
        )
        fastify.post(
          route,
          {
            permissions: 4,
            preHandler: fastify.auth([fastify.authorization.basic]),
          },
          (req, reply) => {
            return reply.send({ method: 'POST' })
          }
        )
      })
    })
  )

  app.ready((err) => {
    t.error(err)

    tryRoutes.forEach((route) => {
      app.inject(
        {
          url: route,
        },
        (err, res) => {
          t.error(err)

          t.equal(res.statusCode, 401)
          t.equal(
            res.headers[('content-type', 'application/json; charset=utf-8')]
          )
          t.equal(JSON.parse(res.body).error, 'Unauthorized')
        }
      )
      app.inject(
        {
          url: route,
          headers: authorizationHeader,
          method: 'GET',
        },
        (err, res) => {
          t.error(err)

          t.equal(res.statusCode, 200)
          t.equal(
            res.headers[('content-type', 'application/json; charset=utf-8')]
          )
          t.equal(JSON.parse(res.body).method, 'GET')
        }
      )
      app.inject(
        {
          url: route,
          headers: authorizationHeader,
          method: 'POST',
        },
        (err, res) => {
          t.error(err)

          t.equal(res.statusCode, 200)
          t.equal(
            res.headers[('content-type', 'application/json; charset=utf-8')]
          )
          t.equal(JSON.parse(res.body).method, 'POST')
        }
      )
    })
  })
})

test('Do custom permissions work', (t) => {
  t.plan(10)

  const app = build(t)

  app.register(
    fp(
      async (fastify) => {
        fastify.permissions.addPermission('CUSTOM_PERMISSION')

        t.type(fastify.PERMISSIONS.CUSTOM_PERMISSION, 'number')

        await createTestUser(
          fastify,
          fastify.PERMISSIONS.CUSTOM_PERMISSION,
          false
        )

        fastify.get(
          '/api/test',
          {
            permissions: fastify.PERMISSIONS.CUSTOM_PERMISSION,
            preHandler: fastify.auth([fastify.authorization.basic]),
          },
          (req, reply) => {
            return reply.send({ message: 'This is an test' })
          }
        )
      },
      { dependencies: ['models'] }
    )
  )

  app.ready((err) => {
    t.error(err)

    // With authorization: 'This is an test' response
    app.inject(
      {
        url: '/api/test',
        headers: authorizationHeader,
      },
      (err, res) => {
        t.error(err)

        t.equal(res.statusCode, 200)
        t.equal(
          res.headers[('content-type', 'application/json; charset=utf-8')]
        )
        t.equal(JSON.parse(res.body).message, 'This is an test')
      }
    )

    // Without authorization 401
    app.inject(
      {
        url: '/api/test',
      },
      (err, res) => {
        t.error(err)

        t.equal(res.statusCode, 401)

        t.equal(
          res.headers[('content-type', 'application/json; charset=utf-8')]
        )
        t.equal(JSON.parse(res.body).error, 'Unauthorized')
      }
    )
  })
})
