const bcrypt = require('bcrypt')

const db = require('../db')

const SALT_ROUNDS = 10

db.tx('seed', async t => {
  const victimPwHashPromise = bcrypt.hash('foo', SALT_ROUNDS)
  const attackerPwHashPromise = bcrypt.hash('bar', SALT_ROUNDS)
  await t.none('DROP TABLE IF EXISTS "transactions"')
  await t.none('DROP TABLE IF EXISTS "accounts"')
  await t.none(
    `CREATE TABLE "accounts" (
      "id" SERIAL PRIMARY KEY,
      "username" VARCHAR NOT NULL UNIQUE,
      "hash" TEXT NOT NULL,
      "balance" INTEGER NOT NULL
    )`
  )
  await t.none(
    `CREATE TABLE "transactions" (
      "id" SERIAL PRIMARY KEY,
      "from" INTEGER REFERENCES "accounts",
      "to" INTEGER REFERENCES "accounts",
      "type" VARCHAR NOT NULL,
      "amount" INTEGER NOT NULL
    )`
  )
  const [victimPwHash, attackerPwHash] = await Promise.all(
    [victimPwHashPromise, attackerPwHashPromise]
  )
  await t.batch([
    t.none(
      'INSERT INTO accounts (username, hash, balance) VALUES ($1, $2, $3)',
      ['victim', victimPwHash, 100]
    ),
    t.none(
      'INSERT INTO accounts (username, hash, balance) VALUES ($1, $2, $3)',
      ['attacker', attackerPwHash, 100]
    )
  ])
})
