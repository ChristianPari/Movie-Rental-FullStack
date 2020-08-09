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

        req.curRented = userData.rentedMovies;

        req.isAdmin = userData !== null && userData.admin.isAdmin === true;

        next()

    } catch (err) {

        console.log("isAdmin:", err.message || err);

        // needed bc I want the user to have to log back in when there JWT expires bc they wont be able to access certain parts of the site anyway
        req.isExpired = true;

        next();

    }

};