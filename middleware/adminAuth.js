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

        if (user === null) throw new Error("User ID within payload was invalid");

        const { _id, email, "adminProps.isAdmin": isAdmin } = user;
        const userInfo = {
            id: _id,
            email: email,
            isAdmin: isAdmin
        };

        if (userInfo.isAdmin === false) throw new Error("User is not a admin");

        req.admin = userInfo;

        next();

    } catch (err) {

        console.log("\n* AdminAuth Error:", err.message || err, "*\n");

        return res.status(401).json({
            status: 401,
            error: "Not Authorized"
        });

    };

};