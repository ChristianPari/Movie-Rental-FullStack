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

        if (decodedData.id === undefined) {

            throw new Error("User ID not defined in the payload");

        };

        const user = await User.findOne({ "_id": decodedData.id });
        isAdmin = user.admin.isAdmin;

        if (!isAdmin) {

            return res.status(401).json({
                status: 401,
                msg: "You are not authorized to access this page"
            });

        } else { next(); };

    } catch (err) {

        console.log("\n* UserAuth Error:", err.message || err, "*\n");

        return res.status(401).json({
            status: 401,
            error: "Not Authorized"
        });

    };

};