const t = require('tap')
const test = t.test

const build = require('../helper')

test('fastify.db and fastify.Sequelize should exist', t => {
  t.plan(3)

  const app = build(t)

  app.ready(err => {
    t.error(err)
    t.ok(app.db)
    t.ok(app.Sequelize)
  })
})

test('Sequelize should work fine with records', t => {
  t.plan(3)

  const app = build(t)

  app.ready(err => {
    t.error(err)
    t.ok(app.db)

    const User = app.db.define('user', {
      name: app.Sequelize.STRING
    })

    User.sync({ force: true })
      .then(() => {
        User.create({ name: 'Iron Man' })
          .then(user => {
            t.ok(user)
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

test('Sequelize should close connection before Fastify closed', t => {
  t.plan(2)

  const app = build(t)

  app.ready(err => {
    t.error(err)

    app.close(() => {
      app.db
        .authenticate()
        .then(() => {
          t.error('connection not closed !')
        })
        .catch(err => {
          t.ok(err)
        })
    })
  })
})
