const express = require('express'),
    router = express.Router(),
    Movie = require('../models/Movie'),
    User = require('../models/User'),
    adminAuth = require('../middleware/adminAuth'),
    extractToken = require("../middleware/extractToken"),
    isAdmin = require("../middleware/isAdmin");

router.get(
    "/",
    extractToken,
    isAdmin,
    async(req, res) => {

        const loggedIn = req.authKey !== undefined;

        const jwtExpired = req.isExpired !== undefined;

        const isAdmin = req.isAdmin || false;

        const rentedMovies = req.curRented;

        // expected query props: 'head, title'
        const { head, title } = req.query,
            availMovies = await Movie.find({ 'inventory.available': { $gte: 1 } });

        const renderOptions = {
            titleVar: title || "Movies Home",
            mainHead: head || "All Movies",
            all_movies: availMovies,
            isLoggedIn: loggedIn,
            isJwtExpired: jwtExpired,
            isAdmin: isAdmin,
            renting: rentedMovies
        }

        res.render('home', renderOptions);

    }
)

router.get(
    "/login",
    (req, res) => {
        res.render('login');
    }
)

router.get(
    "/signup",
    (req, res) => {
        res.render("signup")
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

router.get('/admin', extractToken, adminAuth, (req, res) => {

    res.render('admin-movie');

});

router.get(
    "/profile/:username",
    extractToken,
    isAdmin,
    async(req, res) => {

        const curProfileView = await User.findOne({ "username": req.params.username });
        //^ expected values => Object or null

        if (curProfileView === null) return res.redirect("/");

        const viewingUser = await User.findById(req.userID);

        const renderOpts = {
            profileUser: curProfileView.username,
            profileUserRenting: curProfileView.rentedMovies
        }

        console.log(curProfileView.rentedMovies);

        res.render("profile", renderOpts);

    }
)

module.exports = router;