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
            await User.updateOne({
                "_id": req.user._id
            }, {
                $addToSet: {
                    "rentedMovies": movieQuery
                }
            });

            // modifying the movie doc
            await Movie.updateOne({
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
// @desc return a movie
// @path (server path)/user/return
// @access logged in user
router.patch(
    '/return',
    userAuth,
    async(req, res) => {

        const movieQuery = req.body.movieID;

        try {

            // ensure movie exists 
            const foundMovie = await Movie.findById(movieQuery);

            if (foundMovie === null) throw newError("Movie: [", movieQuery, "] Does Not Exist", 404);

            // ensure movie being returned is in users rented array
            const userID = req.user._id,
                userData = await User.findOne({ "_id": userID }, { rentedMovies: 1, _id: 0 });

            if (userData.rentedMovies.indexOf(movieQuery) === -1) throw newError("User is not currently renting this movie", 409);

            // modify the movie doc by removing the user
            const updatedMovie = await Movie.findByIdAndUpdate(movieQuery, {
                $inc: { "inventory.available": 1 },
                $pull: { "inventory.rented": userID }
            });

            // modify the user doc by removing the movie
            const updatedUser = await User.findByIdAndUpdate(userID, {
                $pull: { "rentedMovies": movieQuery }
            });

            // return all good
            return res.status(200).json({
                status: 200,
                msg: "Successful Return",
                updated_movie: updatedMovie,
                updated_user: updatedUser
            });

        } catch (err) {

            const errMsg = err.message || err,
                errCode = err.code || 500;

            console.log("* Error in movie returning:", errMsg, "*");

            return res.status(errCode).json({
                status: errCode,
                error: errMsg
            });

        };

    });

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

            const errMsg = err.message || err,
                errCode = err.code || 500;

            return res.status(errCode).json({

                status: errCode,
                message: errMsg

            });

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

            const errMsg = err.message || err,
                errCode = err.code || 500;

            return res.status(errCode).json({

                status: errCode,
                message: errMsg

            });

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