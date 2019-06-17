const pgPromise = require('pg-promise')()

const db = pgPromise({
  host: 'localhost',
  port: 5432,
  database: 'csrf-demo'
})

module.exports = db
