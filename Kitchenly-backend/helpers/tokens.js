const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// return signed JWT from user data

function createToken(user) {
    console.assert(user.is_admin !== undefined,
        "createToken passed user without is_admin property");

    let payload = {
        username: user.username,
        is_admin: user.is_admin || false,
    };

    return jwt.sign(payload, SECRET_KEY);
};

module.exports = { createToken };
