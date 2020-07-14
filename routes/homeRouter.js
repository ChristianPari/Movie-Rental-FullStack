const express = require('express'),
    router = express.Router(),
    Movie = require('../models/Movie'),
    adminAuth = require('../middleware/adminAuth');

router.get('/test', (req, res) => {

    res.render('test', { titleVariable: 'Movie Home Page', subHead: "See Movies" });

});

router.get('/mrental', async(req, res) => {

    // expected query props: 'head, title'
    const { head, title } = req.query,
        availMovies = await Movie.find({ 'inventory.available': { $gte: 1 } });

    res.render('home', { titleVar: title || 'Movies Home', mainHead: head || 'All our Movies', all_movies: availMovies });

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