const express = require('express'),
    router = express.Router(),
    Movie = require('../models/Movie'),
    User = require("../models/User"),
    adminAuth = require("../middleware/adminAuth"),
    extractToken = require("../middleware/extractToken"),
    userAuth = require('../middleware/userAuth'),
    newError = require('../utils/newError');

// @desc add or delete inventory of a specific movie via request params
// @path (server path)/movie/invUpd/:op
// @access admin lvl 2 and higher
router.patch(
    "/updateinv",
    extractToken,
    adminAuth,
    async(req, res) => {

        const { movieID, inc, isIncrease = true } = req.body,
            adminLevel = req.user.admin.adminLevel;

        try {

            // movieID
            if (typeof movieID !== "string" || movieID.length !== 24) throw newError("Movie ID is invalid ID", 400);

            // inc
            if (typeof inc !== "number" || inc < 0) throw newError("Increment Number is invalid", 400);

            let limit; // going to be set to the admins' limitation of incereasing or decreasing a movies' inventory

            switch (adminLevel) {
                case 1:
                    limit = 1;
                    break;

                case 2:
                    limit = 10;
                    break;

                case 3:
                    limit = 100;
                    break;
            }

            if (inc > limit) // if inc is greater than admins' limitation throw error
                throw newError(`Not Authorized (admin level: ${adminLevel}) to Manipulate by: ${inc}`, 401);

            const increment = isIncrease === true ? inc : -inc,
                foundMovie = await Movie.findById(movieID);

            // ensuring movie exists
            if (foundMovie === null) throw newError(`Movie with ID: ${movieID} doesn't exist`, 404);

            // if inventory would go below 0 on request then throw error
            if (foundMovie.inventory.available + increment < 0) throw newError("Movie inventory cannot be negative", 400);

            const updatedMovie = await Movie.findOneAndUpdate({ "_id": movieID }, { $inc: { "inventory.available": increment } }, { new: 1 });

            return res.status(200).json({
                status: 200,
                msg: "Successful Inventory Change",
                new: updatedMovie
            });

        } catch (err) {

            const { message = err, code = 500 } = err;

            return res.status(code).json({
                status: code,
                error: message
            })

        }

    }
);

// @desc patch/update all movie docs in db from the request body
// @path (server path)/movie/patch/allMovies
// @access admin
router.patch(
    "/patch/allMovies",
    extractToken,
    adminAuth,
    async(req, res) => {

        try {

            const updates = req.body;

            const report = await Movie.updateMany({}, updates);

            return res.json({
                allDoc: await Movie.find({}),
                report: report,
                message: "Succesful Patch"
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

// @desc get all movies from the db
// @path (server path)/movie/all
// @access public
router.get(
    '/all',
    async(req, res) => {

        await Movie.find({})
            .then(allMovies => {

                return res.status(200).json({

                    status: 200,
                    message: 'All Movies within our Database',
                    all_movies: allMovies

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

    });

// @desc get a specific movie via document id
// @path (server path)/movie/:movie_id
// @access public
router.get(
    '/:movie_id',
    async(req, res) => {

        await Movie.findById(req.params.movie_id)
            .then(movie => {

                return res.status(200).json({

                    status: 200,
                    message: `Successful GET of movie: '${movie.title}'`,
                    movie_data: movie

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

    });

// @desc get every movie that is either available or rented via true or false as request params
// @path (server path)/movie/available/:available
// @access public
router.get(
    '/available/:available',
    findAvail,
    (req, res) => {

        try {

            const movies = req.req_movies;
            let request = req.params.available;

            if (req.params.available == true) {

                request = 'available';

            } else {

                request = 'unavailable';

            }

            return res.status(200).json({

                status: 200,
                message: `These are our ${request} movies`,
                movies: movies

            });

        } catch (err) {

            const errMsg = err.message || err,
                errCode = err.code || 500;

            return res.status(errCode).json({

                status: errCode,
                message: errMsg

            });

        }

    });

// @desc post/create a new movie and have it stored as a doc within the db
// @path (server path)/movie
// @access admin
router.post(
    '/',
    extractToken,
    adminAuth,
    async(req, res) => {

        try {

            const newMovie = new Movie(req.body);

            await Movie.create(newMovie);

            return res.status(201).json({

                status: 201,
                message: 'Successful Creation of a New Movie',
                new_movie: newMovie

            });

        } catch (err) {

            const errMsg = err.message || err,
                errCode = err.code || 500;

            return res.status(errCode).json({

                status: errCode,
                message: errMsg

            });
        }

    });

// @desc delete a movie doc from the db
// @path (server path)/movie/:movie_id
// @access admin
router.delete(
    '/:movie_id',
    findMovie,
    extractToken,
    adminAuth,
    async(req, res) => {

        const movie = req.found_movie,
            movieID = req.params.movie_id;

        try {

            await Movie.deleteOne({ _id: movieID });

            await User.updateMany({}, { $pull: { "rentedMovies": movieID } });

            return res.status(200).json({

                status: 200,
                message: 'Successful Movie Deletion',
                deleted_movie: movie

            });

        } catch (err) {

            const errMsg = err.message || err,
                errCode = err.code || 500;

            return res.status(errCode).json({

                status: errCode,
                message: errMsg

            });

        }


    });

// @desc patch/update a movie doc from the db
// @path (server path)/movie/:movie_id
// @access admin
router.patch(
    '/:movie_id',
    findMovie,
    extractToken,
    adminAuth,
    async(req, res) => {

        const oldMovie = req.found_movie,
            movieID = req.params.movie_id,
            updatedMovie = req.body;

        try {

            await Movie.updateOne({ _id: movieID }, updatedMovie);

            return res.status(200).json({

                status: 200,
                message: 'Successful Movie Update',
                updated_movie: await Movie.findById(movieID),
                old_movie: oldMovie

            });

        } catch (err) {

            const errMsg = err.message || err,
                errCode = err.code || 500;

            return res.status(errCode).json({

                status: errCode,
                message: errMsg

            });

        }

    });

// TESTING

// router.get(
//     "/adminTest",
//     adminAuth,
//     async(req, res) => {

//         try {

//             return res.json({ msg: "You are Admin", admin_info: req.info });

//         } catch (err) {

//             const errMsg = err.message || err;

//             console.log("\n* Movie Router Error:", errMsg, "*\n");

//             return res.status(500).json({ error: errMsg });

//         };

//     }
// );

// router.patch(
//     "/patch/allMovies",
//     adminAuth,
//     async(req, res) => {

//         try {

//             await Movie.updateMany({}, { "inventory.rented": [] });

//^ shorter faster way to produce this below
// const allMovies = await Movie.find({});

// allMovies.forEach(async movie => {

//     movie.inventory.rented = [];

//     await Movie.replaceOne({ "_id": movie._id }, movie);

// });

// return res.json({
//     movies: await Movie.find({})
// });

//             return res.json({
//                 allDoc: await Movie.find({}),
//                 report: this.report,
//                 message: "Succesful Patch"
//             });

//         } catch (err) {

//             return res.json({
//                 err: err.message || err
//             });

//         }

//     }

// );

module.exports = router;

//* ############### Middleware ###############
async function findMovie(req, res, next) {

    const reqID = req.params.movie_id;

    try {

        req.found_movie = await Movie.findById(reqID);

    } catch (err) {

        return res.status(400).json({

            status: 400,
            message: err.message || err

        });

    }

    next();

};

async function findAvail(req, res, next) {

    const request = req.params.available;

    try {

        req.req_movies = await Movie.find({ available: request });

    } catch (err) {

        return res.status(400).json({

            status: 400,
            message: err.message || err

        })

    }

    next();

};