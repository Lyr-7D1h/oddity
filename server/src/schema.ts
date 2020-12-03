export const envSchema = {
  type: 'object',
  required: [
    'SESSION_SECRET',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'CAPTCHA_CLIENT',
    'CAPTCHA_SERVER',
  ],
  properties: {
    DB_HOST: { type: 'string' },
    DB_NAME: { type: 'string' },
    DB_USERNAME: { type: 'string' },
    DB_PASSWORD: { type: 'string' },
    DB_LOGGING_ENABLED: { type: 'boolean' },
    SESSION_SECRET: { type: 'string' },
    PORT: { type: 'integer' },
    NODE_ENV: { type: 'string' },
    CAPTCHA_CLIENT: { type: 'string' },
    CAPTCHA_SERVER: { type: 'string' },
    SHOW_ROUTES: { type: 'boolean' },
  },
  additionalProperties: false,
}

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      DB_HOST: string
      DB_NAME: string
      DB_USERNAME: string
      DB_PASSWORD: string
      DB_LOGGING_ENABLED: boolean
      SESSION_SECRET: string
      PORT?: number
      NODE_ENV?: string
      CAPTCHA_CLIENT: string
      CAPTCHER_SERVER: string
      SHOW_ROUTES?: boolean
    }
  }
}
