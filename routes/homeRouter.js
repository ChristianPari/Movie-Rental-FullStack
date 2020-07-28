const express = require('express'),
    router = express.Router(),
    Movie = require('../models/Movie'),
    adminAuth = require('../middleware/adminAuth'),
    extractToken = require("../middleware/extractToken");

router.get(
    "/",
    extractToken,
    async(req, res) => {

        const loggedIn = req.authKey !== undefined;

        // expected query props: 'head, title'
        const { head, title } = req.query,
            availMovies = await Movie.find({ 'inventory.available': { $gte: 1 } });

        res.render('home', { titleVar: title || 'Movies Home', mainHead: head || 'All our Movies', all_movies: availMovies, isLoggedIn: loggedIn });

    }
)

router.get(
    "/login",
    (req, res) => {
        res.render('login');
    }
)

router.get('/test', (req, res) => {

    res.render('test', { titleVariable: 'Movie Home Page', subHead: "See Movies" });

});

router.get('/mrental/new', async(req, res) => {

    res.render('newMovie');

});

router.get('/static', (req, res) => {

    res.sendFile(process.cwd() + '/public/homeStatic/old-homePage/home.html');

});

router.get('/mrental/admin/:key', adminAuth, (req, res) => {

    res.render('admin-movie');

});

module.exports = router;