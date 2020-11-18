'use strict'

exports.schema = {
  type: 'object',
  required: ['SESSION_SECRET', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME'],
  properties: {
    DB_HOST: { type: 'string' },
    DB_NAME: { type: 'string' },
    DB_USERNAME: { type: 'string' },
    DB_PASSWORD: { type: 'string' },
    DB_LOGGING_ENABLED: { type: 'boolean' },
    SESSION_SECRET: { type: 'string' },
    PORT: { type: 'integer' },
    NODE_ENV: { type: 'string' },
  },
  additionalProperties: false,
}

exports.data = {
  NODE_ENV: 'testing',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_NAME: 'testing',
  DB_USERNAME: 'test',
  DB_PASSWORD: 'test_pass',
  DB_LOGGING_ENABLED: false,
  SESSION_SECRET: 'this_is_a_very_big_string_which_is_longer_than_32',
}
