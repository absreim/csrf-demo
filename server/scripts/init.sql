BEGIN;

DROP TABLE IF EXISTS "transactions";
DROP TABLE IF EXISTS "accounts";

CREATE TABLE "accounts" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR NOT NULL UNIQUE,
    "hash" TEXT NOT NULL,
    "balance" INTEGER NOT NULL
);

CREATE TABLE "transactions" (
    "id" SERIAL PRIMARY KEY,
    "from" INTEGER REFERENCES "accounts",
    "to" INTEGER REFERENCES "accounts",
    "type" VARCHAR NOT NULL,
    "amount" INTEGER NOT NULL
);

COMMIT;