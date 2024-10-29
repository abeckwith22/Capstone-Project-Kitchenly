"user strict"

// shared config for application; can be rquired in many places.

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret_dev";

const PORT = +process.env.PORT || 3001;

// use dev database, testing database, or via env var, production database
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test") 
        ? "postgresql:///kitchenly_test"
        : process.env.DATABASE_URL || "postgresql:///kitchenly";
}

// speeding up bcrypt to make testing faster (non-test cases will be 15)
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 15

console.log("Kitchenly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR:".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
};
