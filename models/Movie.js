const mongoose = require('mongoose'),
    validator = require('validator'),
    MovieSchema = new mongoose.Schema({

        title: {
            type: String,
            required: true,
            unique: true
        },

        release: {
            type: Number,
            required: true
        },

        imdb_link: {
            type: String,
            required: true,
            unique: true,
            validate: (value) => {

                const urlTest = validator.isURL(value),
                    imdbTest = /imdb/;

                if (!urlTest) {

                    throw new Error('Invalid URL');

                } else if (!imdbTest.test(value)) {

                    throw new Error('Imdb link was invalid');

                }

            }

        },

        img: {
            type: String,
            required: true,
            unique: true,
            validate: (value) => {

                const test = validator.isURL(value);

                if (!test) {

                    throw new Error('Invalid URL');

                }

            }

        },

        inventory: {
            type: Object,
            default: {
                available: {
                    type: Number,
                    default: 1
                },
                rented: {
                    type: Number,
                    default: 0
                }
            }
        }

    });

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;