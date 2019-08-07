const path = require('path')
const express = require('express')
const expressSession = require('express-session')
const MemoryStore = require('memorystore')(expressSession)
const csurf = require('csurf')

const api = require('./routes')
const secured = require('./routes/secured')
const auth = require('./routes/auth')

const PORT = process.env.PORT || 3000

const app = express()

if (process.env.PROXY){
  app.set('trust proxy', true)
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const sessionStore = new MemoryStore({
  checkPeriod: 86400000 // prune expired entries every 24h
})
const session = expressSession({
  secret: process.env.SECRET || 'c0RSB4NKT0Ps3cre7',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
})

app.use(session)
app.use('/api', api)

app.use(csurf())
app.use('/auth', auth)
app.use('/secured', secured)

app.use((err, _, res, __) => {
  const status = err.status || 500
  res.sendStatus(status)
  console.error('Error encountered: ', err)
})

app.use(express.static(path.join(__dirname, '..', 'client', 'public')))

if (!process.env.HEADLESS){
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'))
  })
}

app.listen(PORT, console.log(`Listening on port ${PORT}.`))
