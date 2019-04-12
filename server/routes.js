const express = require('express')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10
const INSUFFICIENT_FUNDS = 'insufficient funds'
const UNKNOWN_RECIPIENT = 'unknown recipient'
const LOCK_NAMESPACE = 1
const TRANSFER_TYPE = 'transfer'
const DEPOSIT_TYPE = 'deposit'

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
          await t.none(
            'SELECT pg_advisory_xact_lock($1, $2)',
            [LOCK_NAMESPACE, senderId]
          )
          const {balance} = await t.one(
            'SELECT balance FROM accounts WHERE id = $1',
            [senderId]
          )
          if (balance < amount){
            const err = new Error()
            err.reasonCode = INSUFFICIENT_FUNDS
            throw err
          }
          const queryResults = await t.batch([
            t.none(
              'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
              [amount, senderId]
            ),
            t.result(
              'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
              [amount, recipientId]
            ),
            t.none(
              'INSERT INTO transactions (from, to, type, amount) VALUES ' +
              '($1, $2, $3, $4)',
              [senderId, recipientId, TRANSFER_TYPE, amount]
            )
          ])
          if (queryResults[1].rowCount !== 1){
            const err = new Error()
            err.reasonCode = UNKNOWN_RECIPIENT
            throw err
          }
        })
      }
      catch (err){
        if (err.reasonCode === INSUFFICIENT_FUNDS){
          res.status(403).send('Insufficient funds.')
        }
        else if (err.reasonCode === UNKNOWN_RECIPIENT){
          res.status(404).send('Unknown recipient.')
        }
        else {
          next(err)
        }
        return
      }
      res.sendStatus(204)
    }
  })
  router.put('/api/account/deposit', async (req, res, next) => {
    const userId = req.session.userId
    const amount = Number(req.body.amount)
    if (!userId){
      res.sendStatus(401)
    }
    else if (!(amount > 0)){
      res.sendStatus(400)
    }
    else {
      try {
        await db.tx(async t => {
          await t.batch([
            t.none(
              'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
              [amount, userId]
            ),
            t.none(
              'INSERT INTO transactions (from, to, type, amount) VALUES ' +
              '($1, $2, $3, $4)',
              [userId, userId, DEPOSIT_TYPE, amount]
            )
          ])
        })
      }
      catch (err){
        next(err)
        return
      }
    }
    res.sendStatus(204)
  })
  router.put('/api/account/withdraw', async (req, res, next) => {
    
  })

  return router

}
