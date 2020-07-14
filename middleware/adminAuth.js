const adminKey = process.env.MOVIE_ADMIN_KEY;

function adminAuth(req, res, next) {

    const userKey = req.params.key;

    if (userKey != adminKey) {

        return res.status(401).json({

            status: 401,
            message: "You are not authorized to access this page"

        });

    }

    next();

};

module.exports = adminAuth;