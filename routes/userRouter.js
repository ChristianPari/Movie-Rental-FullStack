const userAuth = require("../middleware/userAuth");

const router = require("express").Router(),
    User = require("../models/User"),
    validateUser = require("../middleware/validateUser"),
    loginUser = require("../middleware/loginUser"),
    authUser = require("../middleware/userAuth"),
    bcrypt = require('bcrypt'),
    jwt = require("jsonwebtoken"),
    secret = process.env.JWT_SECRET;

//TEST
router.get(
    "/testAuth",
    authUser,
    (req, res) => {

        return res.send("Success, you are logged in");

    }

);

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
            })

        } catch (err) {

            return res.status(500).json({ message: err.message || err });

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

        const token = jwt.sign({ id: req.id }, secret, { expiresIn: "1h" });
        // jwt.sign() creates the encrypted token

        return res.json({ token });

    }

);

module.exports = router;