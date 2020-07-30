This is just another go through wiht connecting a MongoDB Atlas cluster as a database within an Express server.<br>
Technology Used:
- Pug
- Nodemon
- Express
- Mongoose
- Bcrypt
- Json Web Tokens
- Dotenv
- Morgan

## Catch Up
### July 29, 2020

As seen below I really fell behind with the README update log that would be describing what I completed for coding during a specific period. I plan to now continue doing this from this date until the completion of the project.

In the last month I have made HUGE leaps with regards to my Full Stack App creation abilities and have learned so much. In this project I have implemented PugJS for html page creation for all routes that require a webpage, user creation that allows (depending on if is or is not an admin) a different kind of html page to be rendered so that each level of user has access to different abilities on the site. Achieved user security by using Bcrypt to hide sensitive information like a users' password and also implement Json Web Tokens to be able to allow a user to travel to different pages of our site without having to log back in and as well as for when making certain kind of requests. Implemented many authentification middleware to ensure a user is valid or if a user is an admin. Created new ideas of a Full Stack App like using a "utils" folder and having functions within there that don't require the express router paramters. The utility is used to create a new error with the data being passed in as arguments (a string message, and a status code) and this is called whenever an error is being thrown or caught. Have begun allowing admins to add or remove movies from the database and site, as well as alter the inventory.

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
