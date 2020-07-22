const router = require("express").Router(),
    User = require("../models/User"),
    Movie = require("../models/Movie"),
    validateUser = require("../middleware/validateUser"),
    loginUser = require("../middleware/loginUser"),
    userAuth = require("../middleware/userAuth"),
    adminAuth = require("../middleware/adminAuth"),
    bcrypt = require('bcrypt'),
    jwt = require("jsonwebtoken"),
    newError = require("../utils/newError"), //a util to create a custom error
    secret = process.env.JWT_SECRET,
    headKey = process.env.HEAD_AUTH_KEY;

//todo movie renting route
router.patch(
    "/rent",
    userAuth,
    async(req, res) => {

        const movieQuery = req.body.movieID;

        try {
            // make sure movie can be rented/is available
            const query = { "_id": movieQuery, "inventory.available": { $gte: 1 } },
                foundMovie = await Movie.findOne(query);

            console.log("Found Movie:", foundMovie);

            if (foundMovie === null) {

                console.log("* Movie ID caused ERROR renting:", movieQuery, "*");

                throw newError("Movie Not Found or Unavailable", 404);

            };

            // check if the user is already renting the movie
            if (req.user.rentedMovies.indexOf(movieQuery) !== -1) {

                console.log("* Movie: [", movieQuery, "] already being rented by User:", req.user.email, "*");

                throw newError("Movie Already Being Rented", 409);

            };

            // modify the user doc rented movies property
            const rentingUser = await User.updateOne({
                "_id": req.user._id
            }, {
                $addToSet: {
                    "rentedMovies": movieQuery
                }
            });

            // modifying the movie doc
            const rentedMovie = await Movie.updateOne({
                "_id": movieQuery
            }, {
                $addToSet: { "inventory.rented": req.user._id },
                $inc: { "inventory.available": -1 }
            });

            return res.status(200).json({
                status: 200,
                msg: "Successful Rental",
                user: await User.findById(req.user._id),
                movie: await Movie.findById(movieQuery)
            });

        } catch (err) {

            const errMsg = err.message || err,
                errCode = err.code || 500;

            console.log("* Error in movie renting:", errMsg, "*");

            return res.status(errCode).json({
                status: errCode,
                error: errMsg
            });

        };
    }
)

//todo movie return route

// @desc get all users
// @path (server path)/user/all
// @access admin
router.get(
    "/all",
    adminAuth,
    (req, res) => {


    }
)

// @desc post/make a new user and store in users collection
// @path (server path)/user
// @access public
router.post(
    '/',
    validateUser,
    async(req, res) => {

        // not allow user to bypass admin level and isAdmin

        // encrypt password

        req.body.password = await bcrypt.hash(req.body.password, 10);

        try {

            const newUser = await User.create(req.body);

            return res.status(201).json({
                status: 201,
                message: "User Created",
                new_doc: newUser
            });

        } catch (err) {

            return res.status(500).json({ msg: err.message || err });

        };

    }

);

// @desc put/login a new user and store in users collection
// @path (server path)/user
// @access public
router.put(
    '/',
    loginUser,
    (req, res) => {

        try {

            req.headers[headKey] = jwt.sign({ id: req.id }, secret, { expiresIn: "1h" });
            // jwt.sign() creates the encrypted token

            console.log(req.headers[headKey]);

            return res.status(200).json({
                status: 200,
                msg: "Succesful Login"
            });

        } catch (err) {

            return res.status(500).json({ msg: err.message || err });

        };

    }

);

// TESTING

// router.get(
//     "/testAuth",
//     userAuth,
//     (req, res) => {

//         return res.send(req.user);

//     }

// );

// TESTING
// router.get(
//     "/testAdmin",
//     adminAuth,
//     (req, res) => {

//         return res.send(req.admin);

//     }

// );

module.exports = router;