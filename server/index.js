const express = require('express')
const pgPromise = require('pg-promise')()
const expressSession = require('express-session')
const MemoryStore = require('memorystore')(expressSession)

const router = require('./routes')

const app = express()
app.use(express.urlencoded({ extended: false }))

const sessionStore = new MemoryStore({
  checkPeriod: 86400000 // prune expired entries every 24h
})
const session = expressSession({
  secret: 'c0RSB4NKT0Ps3cre37',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { domain: 'localhost' }
})

app.use(session)

app.use((err, _, res) => {
  const status = err.status || 500
  res.sendStatus(status)
  console.log('Error encountered: ', err)
})

const init = () => {
  const db = pgPromise({
    host: 'localhost',
    port: 5432,
    database: 'csrf-demo'
  })
  app.use(router(db))
  app.listen(3000)
}

init()
