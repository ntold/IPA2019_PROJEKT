/*
 * Author:      Nico Berchtold
 * File name:   app.js
 * Version:     1.0
 * Description: The main-file of the backend
 *              Initialise express and other dependencies
 *              Redirects Requests to controller
 */

// Import express
const express = require('express')
// Import morgan
const morgan = require('morgan')
// Import cors
const cors = require('cors')
// Import bodyparser
const bodyParser = require('body-parser')
// Import mongoose
const mongoose = require('mongoose')

// Creates an instance of express
const app = express()
// Serverlog for requests
app.use(morgan('combined'))
// Provides req.body functionality with json
app.use(bodyParser.json())
// Crossplatform requests
app.use(cors())

// Define all the Routes
const messageRoutes = require("./routes/messages")
const roomRoutes = require("./routes/rooms")
const userRoutes = require("./routes/users")

// Routes which should handle requests
app.use('/api/message', messageRoutes)
app.use('/api/room', roomRoutes)
app.use('/api/user', userRoutes)


// Connection to mongoDB via mongoose. 127.0.0.1 equals localhost
mongoose.connect('mongodb://127.0.0.1/IPA_Chat-App', { useNewUrlParser: true })
    // If the connection was succsessfully created, log this
    .then(() => console.log('Connection was successful'))
    // If not, log that
    .catch(err => console.error("An error has eccourd:", err));

// App listens on every action taken on port 8081
app.listen(process.env.PORT || 8081)


// Export everything as "app"
module.exports = app;