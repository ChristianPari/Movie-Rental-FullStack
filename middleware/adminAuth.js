const jwt = require('jsonwebtoken'),
    User = require("../models/User");

module.exports = async(req, res, next) => {

    const {

        JWT_SECRET: jwtKey,
        HEAD_AUTH_KEY: headerKey

    } = process.env,
        token = req.headers[headerKey];

    try {

        const decodedData = jwt.verify(token, jwtKey);

        if (decodedData.id === undefined && decodedData.id.length != 24) {

            throw new Error("User ID not defined in the payload OR the length was invalid");

        };

        const query = { _id: decodedData.id, "admin.isAdmin": true },
            projection = { password: 0, __v: 0 },
            user = await User.findOne(
                query,
                projection
            );

        if (user === null) throw new Error("User is not an admin");

        req.admin = user;

        next();

    } catch (err) {

        console.log("\n* AdminAuth Error:", err.message || err, "*\n");

        return res.status(401).json({
            status: 401,
            error: "Not Authorized"
        });

    };

};