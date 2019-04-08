const express = require('express')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10
const INSUFFICIENT_FUNDS = 1
const LOCK_NAMESPACE = 1

module.exports = (db) => {

  const router = express.router()

  router.get('/api/auth/status', async (req, res, next) => {
    const userId = req.session.userId
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
  router.post('/api/auth/login', async (req, res, next) => {
    if (!(req.body.username && req.body.password)) {
      res.sendStatus(400)
      return
    }
    const {username, password} = req.body
    let userRow = null
    try {
      userRow = await db.one(
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
  router.post('/api/auth/create', async (req, res, next) => {
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
          const createdUserRow = await db.none(
            'INSERT INTO accounts (username, hash) VALUES ($1, $2)' +
            ' RETURNING id',
            [username, hash]
          )
          userId = createdUserRow.id
        }
        catch (err){
          next(err)
          return
        }
        req.session.userId = userId
        res.sendStatus(204)
      }
    }
  })
  router.post('/api/account/transfer', async (req, res, next) => {
    const senderId = req.session.userId
    const recipientId = req.body.recipientId
    const amount = Number(req.body.amount)
    if (!senderId){
      res.sendStatus(401)
    }
    else if (!(recipientId && amount > 0)){
      res.sendStatus(400)
    }
    else {
      try {
        await db.tx(async t => {
          // acquire locks in a specified order
          // to avoid deadlocks
          let firstLockId = senderId
          let secondLockId = recipientId
          if (senderId < recipientId){
            firstLockId = recipientId
            secondLockId = senderId
          }
          await t.batch([
            t.none(
              'SELECT pg_advisory_xact_lock($1, $2)',
              [LOCK_NAMESPACE, firstLockId]
            ),
            t.none(
              'SELECT pg_advisory_xact_lock($1, $2)',
              [LOCK_NAMESPACE, secondLockId]
            )
          ])
          const {balance} = await t.one(
            'SELECT balance FROM accounts WHERE id = $1',
            [senderId]
          )
          if (balance < amount){
            const err = new Error()
            err.reasonCode = INSUFFICIENT_FUNDS
            throw err
          }
          await t.batch([
            t.none(
              'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
              [senderId]
            ),
            t.none(
              'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
              [recipientId]
            )
          ])
        })
      }
      catch (err){
        if (err.reasonCode === INSUFFICIENT_FUNDS){
          res.status(403).send('Insufficient funds.')
        }
        else {
          next(err)
        }
      }
    }
  })

  return router

}
