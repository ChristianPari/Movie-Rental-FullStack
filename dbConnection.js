const mongoose = require('mongoose'),
    mongoURI = process.env.MONGO_URI,
    deprecatedObj = {

        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false

    },
    spacer = require('./spacer');

function dbConnect() {

    mongoose.connect(mongoURI, deprecatedObj, (err) => {

        if (err) {

            console.log('Error: ', err);

        }

        console.log(
            spacer('Connection Established to Database') +
            '\nConnection Established to Database\n' +
            spacer('Connection Established to Database') +
            '\n');

    })

    mongoose.connection.on('error', err => {

        console.log(
            spacer('An error occured when trying to connect to MongoDB:') +
            `\nAn error occured when trying to connect to MongoDB:\n${err}\n` +
            spacer('An error occured when trying to connect to MongoDB:') +
            '\n');

    });

    mongoose.connection.on('connected', () => {

        console.log(
            spacer('Connecting') +
            '\nConnecting\n' +
            spacer('Connecting') +
            `\nURI: ${mongoURI}\n`);

    });


};

module.exports = dbConnect;