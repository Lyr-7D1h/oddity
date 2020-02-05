'use strict'

module.exports = () => {
  return {
    NODE_ENV: 'testing',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_NAME: 'testing',
    DB_USERNAME: 'test',
    DB_PASSWORD: 'test_pass',
    DB_LOGGING_ENABLED: true,
    SESSION_SECRET: 'this_is_a_very_big_string_which_is_longer_than_32',
    ADMIN_SECRET: 'secret'
  }
}
