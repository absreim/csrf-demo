const express = require('express')

const expressSession = require('express-session')
const MemoryStore = require('memorystore')(expressSession)
const pgPromise = require('pg-promise')()
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

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

let db = null // to be connected later, before the server starts listening

app.use((err, _, res) => {
  const status = err.status || 500
  res.sendStatus(status)
  console.log('Error encountered: ', err)
})

app.post('/api/auth/login', async (req, res, next) => {
  if (!(req.body.username && req.body.password)) {
    const err = new Error(
      'Login request received without username and/or password.'
    )
    err.status = 403
    next(err)
    return
  }
  const {username, password} = req.body
  let userRow = null
  try {
    userRow = await this.db.one(
      'SELECT id, hash FROM accounts WHERE username = $1',
      [username]
    )
  }
  catch (err) {
    next(err)
    return
  }
  const {id, hash} = userRow
  let compareResult = null
  try {
    compareResult = await bcrypt.compare(password, hash)
  }
  catch (err){
    next(err)
    return
  }
  if (compareResult){
    req.session.userId = id
    res.sendStatus(204)
  }
  else {
    res.sendStatus(401)
  }
})
