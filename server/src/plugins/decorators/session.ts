import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import FastifySessionPlugin from 'fastify-session'
import connectSessionSequelize from 'connect-session-sequelize'
import { Store } from 'express-session'

const SequelizeStore = connectSessionSequelize(Store)

const sessionPlugin: FastifyPluginCallback = (fastify, _, done) => {
  const store = new SequelizeStore({
    db: fastify.db,
  })
  const opts: FastifySessionPlugin.Options = {
    secret: fastify.config.SESSION_SECRET,
    cookie: {
      httpOnly: !(fastify.config.NODE_ENV === 'development'), // set httpOnly and secure off when in dev
      secure: !(fastify.config.NODE_ENV === 'development'),
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // session is valid for 14 days
    },
    store,
  }

  FastifySessionPlugin(fastify, opts, done)

  store.sync()

  done()
}

export default fp(sessionPlugin, {
  name: 'session',
  dependencies: ['sequelize'],
})
