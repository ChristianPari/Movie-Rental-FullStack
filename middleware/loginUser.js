const bcrypt = require("bcrypt"),
    validator = require("validator"),
    User = require("../models/User");

const failedLogin = (req, res) => {

    return res.status(409).json({ msg: "Login Failed" });

};

module.exports = async(req, res, next) => {

    try {

        const email = req.body.email,
            validEmail = (email === undefined || email.trim() === '') ?
            false :
            validator.isEmail(email);

        if (!validEmail) {

            console.error('\nLogin Failed: Email Not Valid');

            failedLogin();

        };

        const user = await User.findOne({ email: req.body.email });

        if (user === null) {

            console.error('\nLogin Failed: Email Not In Use');

            failedLogin();

        };

        const pass = req.body.password,
            testPass = (pass === undefined || pass.trim() === '') ?
            false :
            await bcrypt.compare(pass, user.password);

        if (!testPass) {

            console.error('\nLogin Failed: Password Invalid');

            failedLogin();

        };

        req.id = user._id;

        next();

    } catch (err) {

        return res.status(500).json({

            errorAt: err.stack,
            msg: err.message || err

        });

    };

};