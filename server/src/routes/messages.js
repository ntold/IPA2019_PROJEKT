/*
 * Author:      Nico Berchtold
 * File name:   message.js
 * Version:     1.0
 * Description: Redirects every API on /api/message/ request to
 *              the controllers
 *        
 */


// Import all Requirements
const express = require('express');
const router = express.Router();

// Declare Messagecontroller
const MessageController = require('../controller/messages')

// Requires the auth middleware. Checks befor every Request if a user is allowed
// to take the API call
const checkAuth = require('../middleware/check-auth')


// Get all messages
router.get('/', checkAuth, MessageController.messages_get_all);

// Get message by RoomID
router.get('/:roomid', checkAuth, MessageController.messages_get_by_roomID)

// Add new message
router.post('/', checkAuth, MessageController.messages_create_message)

// Delete message
router.delete("/:id", checkAuth, MessageController.messsages_delete_message)

// TODO: KOMMENTIEREN
const io = require('socket.io')(4000);

io.on('connection', function (socket) {
    socket.on('create', function (session) {

        socket.join(session);
        console.log("User Connected on Room:", session)
    });

    socket.on('leave', function (session) {
        socket.leave(session);
        console.log("User disconnected on session", session)
    });

    socket.on('save-message', (data) => {
        console.log("Message:", data)
        io.in(data.room).emit('new-message', { message: data });
    });

});

// Export the module, to accsess this date from other files
module.exports = router;
