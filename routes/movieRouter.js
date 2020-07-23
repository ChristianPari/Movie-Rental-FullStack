const express = require('express'),
    router = express.Router(),
    Movie = require('../models/Movie'),
    adminAuth = require("../middleware/adminAuth"),
    userAuth = require('../middleware/userAuth'),
    newError = require('../utils/newError');

//todo movie route to add or delete innventory

// @desc add inventory
// @path (server path)/movie/addin
// @access admin lvl 2
router.patch(
    "/addin",
    adminAuth,
    async(req, res) => {

        const adminLvl = req.user.admin.adminLevel;

        try {

            const inc = req.body.inc;

            //todo
            // admin level allows certain increase and descrease (lvl 1: no ability to change inventory, lvl 2: 10+-, lvl 3: 100+-)

            if (adminLvl <= 1 || (adminLvl === 2 && inc > 10) || (adminLvl === 3 && inc > 100))
                throw newError("Not Authorized", 401)


            const updatedMovie = await Movie.findByIdAndUpdate(req.body.movieID, { $inc: { "inventory.available": inc } }, { new: 1 });

            return res.status(200).json({
                status: 200,
                msg: "Successful Inventory Change",
                new: updatedMovie
            });

        } catch (err) {

            const errMsg = err.message || err,
                errCode = err.code || 500;

            return res.status(errCode).json({
                status: errCode,
                error: errMsg
            });

        };
    }
);

router.patch(
    "/invUpd/:op",
    adminAuth,
    async(req, res) => {

        const adminLvl = req.user.admin.adminLevel;

        try {

            const inc = req.body.inc;

            //todo
            // admin level allows certain increase and descrease (lvl 1: no ability to change inventory, lvl 2: 10+-, lvl 3: 100+-)

            if (req.params.op === "inc") {

                if (adminLvl <= 1 || (adminLvl === 2 && inc > 10) || (adminLvl === 3 && inc > 100))
                    throw newError("Not Authorized", 401)

            } else if (req.params.op === "dec") {

                if (adminLvl <= 1 || (adminLvl === 2 && inc < -10) || (adminLvl === 3 && inc < -100))
                    throw newError("Not Authorized", 401)

            } else { throw newError("Invalid parameter being passed", 404); };

            const updatedMovie = await Movie.findByIdAndUpdate(req.body.movieID, { $inc: { "inventory.available": inc } }, { new: 1 });

            return res.status(200).json({
                status: 200,
                msg: "Successful Inventory Change",
                new: updatedMovie
            });

        } catch (err) {

            const errMsg = err.message || err,
                errCode = err.code || 500;

            return res.status(errCode).json({
                status: errCode,
                error: errMsg
            });

        };
    }
);

// @desc patch/update all movie docs in db from the request body
// @path (server path)/movie/patch/allMovies
// @access admin
router.patch(
    "/patch/allMovies",
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