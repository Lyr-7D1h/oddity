const HOST = process.env.DB_HOST || 'localhost'
const DATABASE = process.env.DB_NAME || 'oddity'
const USERNAME = process.env.DB_USERNAME || 'oddity'
const PASSWORD = process.env.DB_PASSWORD

const config = {
  username: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  host: HOST,
  port: 5432,
  dialect: 'postgres'
}

// Only using one database at all times credentials may change of db when testing or in dev
module.exports = {
  development: config,
  production: config,
  test: config,
  testing: config
}
