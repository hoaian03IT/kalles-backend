const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthenticated 1" });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(401).json({ message: "Unauthenticated 2" });
            req.user = user;
        });
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}

module.exports = auth;
