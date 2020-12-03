// const t = require('tap')
// const bcrypt = require('../../plugins/decorators/node_modules/bcrypt')

// const test = t.test

// // clear all tables
// require('../db.helper').clear()

// const build = require('../build.helper')

// const testRole = {
//   name: 'Test',
//   permissions: 1,
// }

// const hash = bcrypt.hashSync('test', 12)
// const testUser = {
//   username: 'Test',
//   identifier: 'test',
//   email: 'test@test.com',
//   roleId: 1,
//   password: hash,
//   ip: '127.0.0.1',
// }

// const basicTest = (app) => {
//   app.register(async (fastify) => {
//     fastify.get(
//       '/test',
//       {
//         preHandler: app.auth([app.authorization.basic]),
//         permissions: 1,
//       },
//       (request, reply) => {
//         reply.send(request.user.id)
//       }
//     )
//   })
// }

// const createTestUser = (app) => {
//   return new Promise((resolve, reject) => {
//     app.models.role
//       .create(testRole)
//       .then((role) => {
//         testUser.roleId = role.id
//         app.models.user
//           .create(testUser)
//           .then((user) => {
//             resolve(user)
//           })
//           .catch((err) => reject(err))
//       })
//       .catch((err) => reject(err))
//   })
// }

// test('Basic Auth - Can not authorize without credentials', (t) => {
//   t.plan(5)

//   const app = build(t)

//   basicTest(app)

//   app.ready((err) => {
//     t.error(err)

//     app.inject(
//       {
//         url: '/test',
//       },
//       (err, res) => {
//         t.error(err)
//         t.equal(res.statusCode, 401)

//         t.deepEqual(
//           res.headers['content-type'],
//           'application/json; charset=utf-8'
//         )

//         t.deepEqual(JSON.parse(res.body), {
//           statusCode: 401,
//           error: 'Unauthorized',
//           message: 'Unauthorized',
//         })
//       }
//     )
//   })
// })

// test('Basic Auth - Can authorize', (t) => {
//   t.plan(4)

//   const app = build(t)

//   basicTest(app)

//   app.ready((err) => {
//     t.error(err)

//     app.models.role
//       .create(testRole)
//       .then((role) => {
//         testUser.roleId = role.id

//         app.models.user
//           .create(testUser)
//           .then((testUser) => {
//             app.inject(
//               {
//                 url: '/test',
//                 headers: {
//                   Authorization:
//                     'Basic ' + Buffer.from('test:test').toString('base64'), // Base64 admin:admin
//                 },
//               },
//               (err, res) => {
//                 t.error(err)

//                 t.equal(res.statusCode, 200)

//                 t.equal(JSON.parse(res.body), testUser.id)
//               }
//             )
//           })
//           .catch((err) => {
//             t.error(err)
//           })
//       })
//       .catch((err) => {
//         t.error(err)
//       })
//   })
// })

// test('Basic Auth - Can not authorize with wrong credentials', (t) => {
//   t.plan(5)

//   const app = build(t)

//   basicTest(app)

//   app.ready((err) => {
//     t.error(err)

//     app.inject(
//       {
//         url: '/test',
//         headers: {
//           Authorization: 'Basic ' + Buffer.from('test:asdf').toString('base64'),
//         },
//       },
//       (err, res) => {
//         t.error(err)
//         t.equal(res.statusCode, 401)

//         t.deepEqual(
//           res.headers['content-type'],
//           'application/json; charset=utf-8'
//         )

//         t.deepEqual(JSON.parse(res.body), {
//           statusCode: 401,
//           error: 'Unauthorized',
//           message: 'Unauthorized',
//         })
//       }
//     )
//   })
// })

// // only('Session Auth - Can authorize', (t) => {
// //   t.plan(2)

// //   const app = build(t)

// //   app.ready((err) => {
// //     t.error(err)

// //     getSession(app, (err, session) => {
// //       t.error(err)
// //       console.log(session)
// //     })
// //   })
// // })

// // TODO: Add session tests when session storage has changed to redis
// // const getSession = (app, cb) => {
// //   createTestUser(app)
// //     .then(() => {
// //       app.inject(
// //         {
// //           url: '/api/auth/login',
// //           headers: {
// //             Authorization:
// //               'Basic ' + Buffer.from('test:test').toString('base64'),
// //           },
// //         },
// //         (err, res) => {
// //           cb(err, res.headers['set-cookie'])
// //         }
// //       )
// //     })
// //     .catch((err) => cb(err))
// //   return cb
// // }
