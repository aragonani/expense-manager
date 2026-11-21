const jwt = require('jsonwebtoken');
require("dotenv").config();

const secret = process.env.jwtSecretKey;

function setUser(user) {
    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || 'user',
        },
        secret,
        {
            expiresIn: "1d",
        },
    );
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

module.exports = { setUser, getUser };
