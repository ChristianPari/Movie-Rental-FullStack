const jwt = require("jsonwebtoken"),
    User = require("../models/User"),
    secret = process.env.JWT_SECRET;

module.exports = async(req, res, next) => {

    const token = req.authKey;

    if (token === undefined) return next();

    try {

        const { id } = jwt.verify(token, secret);
        console.log(id);

        const userData = await User.findById(id);
        console.log(userData);

        req.isAdmin = userData !== null && userData.admin.isAdmin === true;

        next()

    } catch (err) {

        console.log(err.message || err);
        next();

    }

};