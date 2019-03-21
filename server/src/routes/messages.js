// Import all Requirements
const express = require('express');
const router = express.Router();


// Requires the auth middleware
// const checkAuth = require('../middleware/check-auth')


// Declare Messagecontroller
const MessageController = require('../controller/messages')


// Get all messages
router.get('/', MessageController.messages_get_all);

// Get message by RoomID
router.get('/:roomid', MessageController.messages_get_by_roomID)

// Add new message
router.post('/', MessageController.messages_create_message)

// Delete message
router.delete("/:id", MessageController.messsages_delete_message)

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


module.exports = router;
