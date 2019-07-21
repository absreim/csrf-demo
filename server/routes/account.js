const express = require('express')

const db = require('../db')

const INSUFFICIENT_FUNDS = 'insufficient funds'
const UNKNOWN_RECIPIENT = 'unknown recipient'
const LOCK_NAMESPACE = 1
const TRANSFER_TYPE = 'transfer'
const DEPOSIT_TYPE = 'deposit'
const WITHDRAWAL_TYPE = 'withdrawal'

const router = express.Router()

router.all('*', (req, _, next) => {
  if (req.session.userId) {
    next()
  }
  else {
    const authRequiredErr = new Error()
    authRequiredErr.status = 401
    next(authRequiredErr)
  }
})

router.get('/balance', async (req, res, next) => {
  const userId = req.session.userId
  try {
    const { balance } = await db.one(
      'SELECT balance FROM accounts WHERE id = $1',
      [userId]
    )
    res.json({ balance })
  }
  catch (err){
    next(err)
  }
})

router.post('/transfer', async (req, res, next) => {
  const senderId = req.session.userId
  const recipientId = req.body.recipientId
  const amount = Number(req.body.amount)
  if (!(recipientId && amount > 0)){
    res.sendStatus(400)
  }
  else {
    try {
      let newBalance = null
      await db.tx(async t => {
        await t.one(
          'SELECT pg_advisory_xact_lock($1, $2)',
          [LOCK_NAMESPACE, senderId]
        )
        const {balance} = await t.one(
          'SELECT balance FROM accounts WHERE id = $1',
          [senderId]
        )
        if (balance < amount) {
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
            'INSERT INTO transactions ("from", "to", type, amount) VALUES ' +
            '($1, $2, $3, $4)',
            [senderId, recipientId, TRANSFER_TYPE, amount]
          ),
          t.one(
            'SELECT balance FROM accounts WHERE id = $1',
            [senderId]
          )
        ])
        if (queryResults[1].rowCount !== 1) {
          const err = new Error()
          err.reasonCode = UNKNOWN_RECIPIENT
          throw err
        }
        newBalance = queryResults[3].balance
      })
      res.json({balance: newBalance})
    }
    catch (err){
      if (err.reasonCode === INSUFFICIENT_FUNDS) {
        res.status(403).send('Insufficient funds.')
      }
      else if (err.reasonCode === UNKNOWN_RECIPIENT) {
        res.status(404).send('Unknown recipient.')
      }
      else {
        next(err)
      }
    }
  }
})

router.put('/deposit', async (req, res, next) => {
  const userId = req.session.userId
  let recipientId = userId
  if (req.body.recipientId) {
    recipientId = req.body.recipientId
  }
  const amount = Number(req.body.amount)
  if (!(amount > 0)) {
    res.sendStatus(400)
  }
  else {
    try {
      await db.tx(async t => {
        await t.batch([
          t.none(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
            [amount, recipientId]
          ),
          t.none(
            'INSERT INTO transactions ("from", "to", type, amount) VALUES ' +
            '($1, $2, $3, $4)',
            [userId, recipientId, DEPOSIT_TYPE, amount]
          )
        ])
      })
    }
    catch (err) {
      next(err)
      return
    }
    // for privacy reasons, don't return new balance amount
    res.sendStatus(204)
  }
})

router.put('/withdraw', async (req, res, next) => {
  const userId = req.session.userId
  const amount = Number(req.body.amount)
  if (!(amount > 0)) {
    res.sendStatus(400)
  }
  else {
    try {
      let newBalance = null
      await db.tx(async t => {
        await t.one(
          'SELECT pg_advisory_xact_lock($1, $2)',
          [LOCK_NAMESPACE, userId]
        )
        const { balance } = await t.one(
          'SELECT balance FROM accounts WHERE id = $1',
          [userId]
        )
        if (balance < amount){
          const err = new Error()
          err.reasonCode = INSUFFICIENT_FUNDS
          throw err
        }
        const queryResults = await t.batch([
          t.one(
            'UPDATE accounts SET balance = balance - $1 WHERE id = $2 ' +
            'RETURNING balance',
            [amount, userId]
          ),
          t.none(
            'INSERT INTO transactions ("from", "to", type, amount) VALUES ' +
            '($1, $2, $3, $4)',
            [userId, userId, WITHDRAWAL_TYPE, amount]
          )
        ])
        newBalance = queryResults[0].balance
      })
      res.json({balance: newBalance})
    }
    catch (err){
      if (err.reasonCode === INSUFFICIENT_FUNDS) {
        res.status(403).send('Insufficient funds.')
      }
      else {
        next(err)
      }
    }
  }
})

module.exports = router
