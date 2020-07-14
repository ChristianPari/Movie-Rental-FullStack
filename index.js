require('dotenv').config();
const express = require('express'),
    morgan = require('morgan'),
    dbConnect = require('./dbConnection'),
    spacer = require('./spacer'),
    app = express(),
    port = process.env.PORT || 5000,
    homeRouter = require('./routes/homeRouter'),
    movieRouter = require('./routes/movieRouter'),
    userRouter = require('./routes/userRouter');

app.set('view engine', 'pug');

app.use(morgan("dev"));
app.use(express.json());

dbConnect();

app.use('/', express.static('./public/homeStatic/old-homePage/'));
app.use('/', homeRouter);
app.use('/movie', movieRouter);
app.use('/user', userRouter);

app.listen(port, () => {

    console.log(
        spacer(`Listening on port: ${port}`) +
        `\nListening on port: ${port}\n` +
        spacer(`Listening on port: ${port}`) +
        '\n')

});