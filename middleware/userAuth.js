const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async(req, res, next) => {

    const {

        JWT_SECRET: jwtKey,
        HEAD_AUTH_KEY: headerKey

    } = process.env,
        token = req.headers[headerKey];

    try {

        const decodedData = jwt.verify(token, jwtKey);

        if (decodedData.id === undefined) {

            throw new Error("User ID not defined in the payload");

        } else { req.user_id = decodedData.id; };

        const user = await User.findOne({ "_id": decodedData.id });

        if (user === null) {

            throw new Error("User ID in payload was invalid in mongo/mongoose");

        };

        req.user = user;

        next();

    } catch (err) {

        console.log("\n* UserAuth Error:", err.message || err, "*\n");

        return res.status(401).json({
            status: 401,
            error: "Not Authorized"
        });

    };

};