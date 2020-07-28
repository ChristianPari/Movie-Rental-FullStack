const jwt = require('jsonwebtoken'),
    User = require("../models/User"),
    newError = require("../utils/newError");

module.exports = async(req, res, next) => {

    const { JWT_SECRET: jwtKey } = process.env,
        token = req.authKey;

    try {

        const decodedData = jwt.verify(token, jwtKey);

        if (decodedData.id === undefined && decodedData.id.length != 24) {

            throw newError("User ID not defined in the payload OR the length was invalid", 404);

        };

        const query = { _id: decodedData.id, "admin.isAdmin": true },
            projection = { password: 0, __v: 0 },
            user = await User.findOne(
                query,
                projection
            );

        if (user === null) throw newError("User is not an admin", 401);

        req.user = user;

        next();

    } catch (err) {

        const errMsg = err.message || err,
            errCode = err.code || 500;

        return res.status(errCode).json({
            status: errCode,
            error: errMsg
        });

    };

};