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

//todo merge the rent and return routes into a single request

router.patch(
    "/rent_return",
    userAuth,
    async(req, res) => {

        const { movieID, isRenting = true } = req.body;

        try {
            // make sure movie can be rented/is available
            const query =
                isRenting === true ? { "_id": movieID, "inventory.available": { $gte: 1 } } : { "_id": movieID };

            const userUp =
                isRenting === true ? { $addToSet: { rentedMovies: movieID } } : { $pull: { rentedMovies: movieID } };

            const movieUp =
                isRenting === true ? { $addToSet: { "inventory.rented": req.user._id }, $inc: { "inventory.available": -1 } } : { $pull: { "inventory.rented": req.user._id }, $inc: { "inventory.available": 1 } };

            const foundMovie = await Movie.findOne(query);

            console.log("Found Movie:", foundMovie);

            if (foundMovie === null) {

                console.log("* Movie ID caused ERROR renting:", movieID, "*");

                throw newError("Movie Not Found or Unavailable", 404);

            };

            // check if the user is already renting the movie or is going to rent
            const curRenting =
                req.user.rentedMovies.indexOf(movieID) === -1 ?
                false :
                true;

            const isDoing =
                curRenting === false ?
                "isn't" :
                "is already";

            if (isRenting === curRenting) {

                console.log(`* Movie [${movieID}] ${isDoing} being rented by User [${req.user.email}] *`);

                throw newError(`Movie ${isDoing} Being Rented`, 409);

            };

            // modify the user doc rented movies property
            await User.findByIdAndUpdate({
                "_id": req.user._id
            }, userUp, { new: 1 });

            // modifying the movie doc
            await Movie.findByIdAndUpdate({
                    "_id": movieID
                },
                movieUp, { new: 1 }
            );

            const operation =
                isRenting === false ?
                "Return" :
                "Rental";

            return res.status(200).json({
                status: 200,
                msg: `Successful ${operation}`,
                user: await User.findById(req.user._id),
                movie: await Movie.findById(movieID)
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
);

// @desc get all users
// @path (server path)/user/all
// @access admin
router.get(
    "/all",
    adminAuth,
    async(req, res) => {

        await User.find({})
            .then(allUsers => {

                return res.status(200).json({

                    status: 200,
                    message: 'All Users within our Database',
                    all_movies: allUsers

                });

            })
            .catch(err => {

                const errMsg = err.message || err,
                    errCode = err.code || 500;

                return res.status(errCode).json({

                    status: errCode,
                    message: errMsg

                });

            });


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

            const token = jwt.sign({ id: req.id }, secret, { expiresIn: "1h" });
            // jwt.sign() creates the encrypted token

            return res.status(200).json({
                status: 200,
                msg: "Succesful Login",
                token: token
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