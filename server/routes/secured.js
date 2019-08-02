const express = require('express')

const account = require('./account')

const router = express.Router()
const transferHandler = account.transferHandler

router.post('/account/transfer', transferHandler)

module.exports = router
