const express = require('express')

const account = require('./account')
const transactions = require('./transactions')

const router = express.Router()

router.use('/account', account.router)
router.use('/transactions', transactions)

module.exports = router
