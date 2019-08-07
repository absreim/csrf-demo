const express = require('express')
const bcrypt = require('bcrypt')

const db = require('../db')

const SALT_ROUNDS = 10

const router = express.Router()

router.get('/status', async (req, res, next) => {
  const userId = req.session.userId
  res.cookie('XSRF-TOKEN', req.csrfToken())
  if (userId){
    let username = null
    try {
      const userRow = await db.one(
        'SELECT username FROM accounts WHERE id = $1',
        [userId]
      )
      username = userRow.username
    }
    catch (err){
      next(err)
      return
    }
    res.json({username})
  }
  else {
    res.json({username: null})
  }
})

router.post('/login', async (req, res, next) => {
  if (!(req.body.username && req.body.password)) {
    res.sendStatus(400)
    return
  }
  const {username, password} = req.body
  let userRow = null
  try {
    userRow = await db.oneOrNone(
      'SELECT id, hash FROM accounts WHERE username = $1',
      [username]
    )
  }
  catch (err) {
    next(err)
    return
  }
  if (!userRow){
    res.sendStatus(401)
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
    res.json({ username })
  }
  else {
    res.sendStatus(401)
  }
})

router.post('/create', async (req, res, next) => {
  if (!(req.body.username && req.body.password)) {
    res.sendStatus(400)
  }
  else {
    const {username, password} = req.body
    let existingUserRow = null
    try {
      existingUserRow = await db.oneOrNone(
        'SELECT FROM accounts WHERE username = $1',
        [username]
      )
    }
    catch (err){
      next(err)
      return
    }
    if (existingUserRow){
      res.status(403).send('A user with that name already exists.')
    }
    else {
      let hash = null
      try {
        hash = await bcrypt.hash(password, SALT_ROUNDS)
      }
      catch (err){
        next(err)
        return
      }
      let userId = null
      try {
        const createdUserRow = await db.one(
          'INSERT INTO accounts (username, hash, balance) VALUES ($1, $2, $3)' +
          ' RETURNING id',
          [username, hash, 0]
        )
        userId = createdUserRow.id
      }
      catch (err){
        next(err)
        return
      }
      req.session.userId = userId
      res.json({username})
    }
  }
})

router.post('/logout', (req, res, next) => {
  req.session.destroy( err => {
    if (err) {
      next(err)
    }
    else {
      res.sendStatus(204)
    }
  })
})

module.exports = router
