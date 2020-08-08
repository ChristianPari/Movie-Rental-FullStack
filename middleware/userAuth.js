const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async(req, res, next) => {

    // req.authKey is coming from the extractToken middleware, we assign the token we extracted to this req property
    const { JWT_SECRET: jwtKey } = process.env,
        token = req.authKey;

    try {

        const decodedData = jwt.verify(token, jwtKey);

        if (decodedData.id === undefined && decodedData.id.length !== 24) {

            throw new Error("User ID not defined in the payload OR the length was invalid");

        }

        const query = { "_id": decodedData.id },
            projection = { password: 0, admin: 0, __v: 0 },
            user = await User.findOne(
                query,
                projection
            );

        if (user === null) { // only if valid length for ID but isn't a valid ID for any doc within the database

            throw new Error("User does not exist");

        };

        console.log("User:", user);

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