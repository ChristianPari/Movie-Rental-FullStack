const mongoose = require("mongoose"),
    User_schema = new mongoose.Schema({
        email: {
            required: true,
            type: String,
            unique: true
        },
        password: {
            required: true,
            type: String,
            minlength: 7,
            maxlength: 100
        },
        adimn: {
            adminLevel: {
                type: Number,
                default: 0
            },
            isAdmin: {
                type: Boolean,
                default: false
            }
        }
    }),
    User = mongoose.model('User', User_schema);

module.exports = User;