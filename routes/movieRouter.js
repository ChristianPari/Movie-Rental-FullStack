const express = require('express'),
    router = express.Router(),
    Movie = require('../models/Movie'),
    adminAuth = require("../middleware/adminAuth"),
    userAuth = require('../middleware/userAuth');

// @desc patch/update all movie docs in db from the request body
// @path (server path)/movie/patch/allMovies
// @access admin
router.patch(
    "/patch/allMovies",
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

            return res.json({
                err: err.message || err
            });


        };

    }
);

// @desc get all movies from the db
// @path (server path)/movie/all
// @access public
router.get(
    '/all',
    userAuth,
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

                return res.status(500).json({

                    status: 500,
                    message: err.message,
                    error: err

                })

            });

    });

// @desc get a specific movie via document id
// @path (server path)/movie/:movie_id
// @access public
router.get(
    '/:movie_id',
    userAuth,
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

                return res.status(500).json({

                    status: 500,
                    message: err.message,
                    error: err

                })

            });

    });

// @desc get every movie that is either available or rented via true or false as request params
// @path (server path)/movie/available/:available
// @access public
router.get(
    '/available/:available',
    userAuth,
    findAvail,
    (req, res) => {

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

    });

// @desc post/create a new movie and have it stored as a doc within the db
// @path (server path)/movie
// @access admin
router.post(
    '/',
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

            return res.status(500).json({

                status: 500,
                messgae: err.message,
                error: err

            });

        }

    });

// @desc delete a movie doc from the db
// @path (server path)/movie/:movie_id
// @access admin
router.delete(
    '/:movie_id',
    adminAuth,
    findMovie,
    async(req, res) => {

        const movie = req.found_movie,
            movieID = req.params.movie_id;

        try {

            await Movie.deleteOne({ _id: movieID });

            return res.status(200).json({

                status: 200,
                message: 'Successful Movie Deletion',
                deleted_movie: movie

            });

        } catch (err) {

            return res.status(500).json({

                status: 500,
                message: err.message,
                error: err

            });

        }


    });

// @desc patch/update a movie doc from the db
// @path (server path)/movie/:movie_id
// @access admin
router.patch(
    '/:movie_id',
    adminAuth,
    findMovie,
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

            return res.status(500).json({

                status: 500,
                message: err.message,
                error: err

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