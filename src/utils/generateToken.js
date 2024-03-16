const jwt = require("jsonwebtoken");

function generateAccessToken(userId) {
    return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 });
}

function generateRefreshToken(userId) {
    return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
