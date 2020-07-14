const User = require('../models/User'),
    validator = require("validator");

module.exports = async(req, res, next) => {

    const email = req.body.email,
        pass = req.body.password;
    let failedFields = [];

    if (!validator.isEmail(email)) {

        failedFields.push({
            field: 'email',
            msg: "Valid Email Required"
        });

    };

    const emailExists = await User.findOne({ 'email': email }) != null;
    //^ Expected outcome: boolean

    if (emailExists) {

        failedFields.push({
            field: 'email',
            msg: "Email Is Already Taken"
        });

    };

    if (!validator.isLength(pass, { min: 7, max: 100 }) || !validator.isAlphanumeric(pass, 'en-US')) {

        failedFields.push({
            field: 'password',
            msg: "Failed Length Requirements OR Used Invalid Characters"
        });

    };

    if (failedFields.length > 0) {

        return res.status(400).json({

            validation_error: failedFields

        })

    } else { next(); };

};