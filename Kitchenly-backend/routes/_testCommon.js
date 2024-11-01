"user strict";

const db = require("../db.js");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens.js");

const testRecipeIds = [];

async function commonBeforeAll() {
    // noinspection SqlWithoutWhere
    // await db.query("DELETE FROM users");
    // await db.query("DELETE FROM recipes");
}

