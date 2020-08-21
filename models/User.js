const mongoose = require("mongoose"),
    User_schema = new mongoose.Schema({

        email: {
            required: true,
            type: String,
            unique: true
        },

        username: {
            required: true,
            type: String,
            unique: true,
            minlength: 3,
            maxlength: 20
        },

        password: {
            required: true,
            type: String,
            minlength: 7,
            maxlength: 100
        },

        admin: {

            adminLevel: {
                type: Number,
                default: 0
            },

            isAdmin: {
                type: Boolean,
                default: false
            }

        },

        rentedMovies: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "movies",
            default: []
        }
    }),
    User = mongoose.model('User', User_schema);

module.exports = User;