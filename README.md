This is just another go through wiht connecting a MongoDB Atlas cluster as a database within an Express server.<br>
Technology Used:
- Nodemon
- Express
- Mongoose
- Dotenv
- Morgan

<h2>June 3, 2020</h2>
<b>12:45pm - 1:45pm</b><br>

Fell behind with updating this README but so far I have created mongoose model and Schema for my movies collection within my database, it has the fields:
- Title
- Availability
- Inventory
- ImDb link
- Img Link
- Release Date

I created a [file that contains a function that connects my MongoDB Atlas cluster to my server](https://github.com/ChristianPari/Intro-to-MongoDB/blob/master/First-Server-002/dbConnection.js) and then I just call the function in my main server file ([index.js](https://github.com/ChristianPari/Intro-to-MongoDB/blob/master/First-Server-002/index.js)). Next I began creating my first route ([home route](https://github.com/ChristianPari/Intro-to-MongoDB/blob/master/First-Server-002/routes/homeRouter.js)) and within this I did all the [CRUD requests](https://github.com/ChristianPari/Intro-to-MongoDB/blob/master/First-Server-002/routes/homeRouter.js) to my database which successfully work and have proper error catches.

<h2>June 1, 2020</h2>
<b>9:30pm - 10:15pm</b><br>

Created my express server and setup my connection to MongoDB Atlas cluster that I will be using as a database.