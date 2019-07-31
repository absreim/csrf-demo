const express = require('express')

const db = require('../db')

const router = express.Router()

router.get('/', async (req, res, next) => {
  const userId = req.session.userId
  if (!userId){
    res.sendStatus(401)
    return
  }
  let rows = null
  try {
    rows = await db.any(
      'SELECT id, "from", "to", type, amount FROM transactions ' +
      'WHERE "from" = $1 OR "to" = $1 ORDER BY id DESC',
      [userId]
    )
  }
  catch (err){
    next(err)
    return
  }
  res.json(rows)
})

module.exports = router
