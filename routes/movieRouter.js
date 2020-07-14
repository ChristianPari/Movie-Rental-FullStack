const express = require('express'),
    router = express.Router(),
    Movie = require('../models/Movie');

router.get('/all', (req, res) => {

    Movie.find({})
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

router.get('/:movie_id', (req, res) => {

    Movie.findById(req.params.movie_id)
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

router.get('/available/:available', findAvail, (req, res) => {

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

router.post('/', async(req, res) => {

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

router.delete('/:movie_id', findMovie, async(req, res) => {

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

router.patch('/:movie_id', findMovie, async(req, res) => {

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

        return res.status(404).json({

            status: 404,
            message: 'Movie Not Found'

        });

    }

    if (req.found_movie == null) {

        return res.status(404).json({

            status: 404,
            message: 'Movie Not Found'

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
            message: err.message,
            error: err

        })

    }

    next();

};