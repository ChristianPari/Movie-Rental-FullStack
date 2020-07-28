const cookie = require("cookie");

module.exports = (req, res, next) => {

    const { token } = cookie.parse(req.headers.cookie || "");

    req.authKey = token;

    next();

};