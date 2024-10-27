"use strict"

// Setting up database for kitchenly app.
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
    db = new Client({
        connectionString: getDatabaseUri(),
    });
} else{
    db = new Client({
        connectionString: getDatabaseUri(),
    });
}

db.connect();

module.exports = db;
