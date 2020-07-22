// create a custom error
module.exports = (msg, status) => {

    const newError = new Error(msg);
    newError.code = status;
    return newError

};