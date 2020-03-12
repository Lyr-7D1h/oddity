const fp = require('fastify-plugin')

// const createDefaultForumCategory = instance => {
//   return new Promise((resolve, reject) => {
//     instance.models.forumCategory
//       .findOrCreate({
//         where: { title: 'Uncategorized' },
//         defaults: {
//           title: 'Uncategorized',
//           order: 0
//         }
//       })
//       .then(([forumCategory, created]) => resolve(created))
//       .catch(err => reject(err))
//   })
// }

module.exports = fp(async instance => {
  instance.log.info('Loading Default Config..')

  const errHandler = err => {
    instance.log.fatal(err)
    throw err
  }

  // createDefaultForumCategory(instance)
  //   .then(created => {
  //     if (created) instance.log.info('Created Uncategorized Forum Category')
  //   })
  //   .catch(errHandler)
})
