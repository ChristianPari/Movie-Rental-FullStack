const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

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

        next();

    } catch (err) {

        console.log("\n* UserAuth Error:", err.message || err, "*\n");

        return res.status(401).json({
            status: 401,
            error: "Not Authorized"
        });

    };

};