// create a custom error
module.exports = (message, status) => {

    const newError = new Error(message);
    newError.code = status;
    return newError

};