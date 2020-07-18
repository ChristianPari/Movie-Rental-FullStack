const express = require('express'),
    router = express.Router(),
    Movie = require('../models/Movie'),
    adminAuth = require("../middleware/adminAuth"),
    userAuth = require('../middleware/userAuth');

// TESTING
router.get(
    "/adminTest",
    adminAuth,
    async(req, res) => {

        try {

            return res.json({ msg: "You are Admin", admin_info: req.info });

        } catch (err) {

            const errMsg = err.message || err;

            console.log("\n* Movie Router Error:", errMsg, "*\n");

            return res.status(500).json({ error: errMsg });

        };

    }
);

// updated Movie Docs
// one time update for the rented field
//todo: make a full on patch to work with any field or add a field to any document
router.patch(
    "/all",
    async(req, res) => {

        try {


            const allMovies = await Movie.find({});

            allMovies.forEach(async movie => {

                movie.inventory.rented = [];

                await Movie.replaceOne({ "_id": movie._id }, movie);

            });

            return res.json({
                movies: await Movie.find({})
            });

        } catch (err) {

            return res.json({
                err: err.message || err
            });

        }

    }

);

// router.patch(
//     "/patch/testing",
//     async(req, res) => {

//         try {

//             const allMovies = await Movie.find({}),
//                 updates = req.body;

//             allMovies.forEach(async movie => {

//                 await Movie.findOneAndUpdate({ "_id": movie._id }, { updates });

//             });

//             return res.json({
//                 old_movies: allMovies,
//                 updated: await Movie.find({})
//             });

//         } catch (err) {

//             return res.json({
//                 err: err.message || err
//             });


//         };

//     }
// );

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