const bcrypt = require('bcrypt')

const db = require('../db')

const SALT_ROUNDS = 10

db.tx('seed', async t => {
  await t.none('DROP TABLE IF EXISTS "transactions"')
  await t.none('DROP TABLE IF EXISTS "accounts"')
  await t.none(`CREATE TABLE "accounts" (
      "id" SERIAL PRIMARY KEY,
      "username" VARCHAR NOT NULL UNIQUE,
      "hash" TEXT NOT NULL,
      "balance" INTEGER NOT NULL
    )`
  )
  await t.none(`CREATE TABLE "transactions" (
      "id" SERIAL PRIMARY KEY,
      "from" INTEGER REFERENCES "accounts",
      "to" INTEGER REFERENCES "accounts",
      "type" VARCHAR NOT NULL,
      "amount" INTEGER NOT NULL
    )`
  )
  const alicePwHash = await bcrypt.hash('foo', SALT_ROUNDS)
  const bobPwHash = await bcrypt.hash('bar', SALT_ROUNDS)
  await t.batch([
    t.none('INSERT INTO accounts (username, hash, balance) VALUES ($1, $2, $3)',
      ['alice', alicePwHash, 200]),
    t.none('INSERT INTO accounts (username, hash, balance) VALUES ($1, $2, $3)',
      ['bob', bobPwHash, 100]
    )
  ])
})
