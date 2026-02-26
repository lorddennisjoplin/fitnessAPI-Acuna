require('dotenv').config();

const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

// Create access token
module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email
    };

    return jwt.sign(data, secret); // no expiration
};

// Verify JWT
module.exports.verify = (req, res, next) => {
    console.log(req.headers.authorization);

    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ auth: "Failed. No Token" });
    }

    token = token.slice(7);

    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({
                auth: "Failed",
                message: err.message
            });
        }

        req.user = decodedToken;
        next();
    });
};

// Error handler
module.exports.errorHandler = (err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    });
};