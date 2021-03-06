/*
 * Author:      Nico Berchtold
 * File name:   messages.js
 * Version:     1.0
 * Description: Gets the requests from /routes/messages.js
 *              Stores and Gets data from the DB   
 *              
 */

// imports Messageschema for mongoose 
const Message = require('../models/Message')

// Gets all Messages from the Database
exports.messages_get_all = (req, res, next) => {
    // .find shows every entry for the MessageSchme
    Message.find((err, messages) => {
        if (err) {
            // Error with Statuscode 500, means "Internal Server Error"
            res.status(500).json({
                error: err
            });
        };
        // If no error occured, it sends all messages in a json file to the client. Status Code 200 means "OK"
        res.status(200).json(messages);
    })
}

// Gets a Message in a certain Room
exports.messages_get_by_roomID = (req, res, next) => {
    // .find searches for the roomID
    Message.find({ roomID: req.params.roomid }, (err, messages) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        res.status(200).json(messages);
    })
}

exports.messages_create_message = (req, res, next) => {
    Message.create(req.body, (err, post) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        } else {
            res.status(200).json({
                message: "Message Sent!"
            });
        }
    });
}

exports.messsages_delete_message = (req, res, next) => {
    Message.findByIdAndRemove(req.params.id, req.body, (err, post) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        res.status(200).json({
            message: "Message deleted!"
        });
    })
}

// WebSocket listens on port 4000
const io = require('socket.io')(4000);

// On Connection
io.on('connection', socket => {
    // Join a Socket
    socket.on('create', session => {

        socket.join(session);
        console.log("User Connected on Room:", session)
    });

    // Leave a Socket
    socket.on('leave', session => {
        socket.leave(session);
        console.log("User disconnected on session", session)
    });

    // Sends the Message to the Sockets ans saves it in the database
    socket.on('save-message', data => {
        Message.create(data, (err, post) => {
            if (err) {
                console.log(error)
            } else {
                console.log("message sent")
            }
        });
        io.in(data.roomID).emit('new-message', { message: data });
    });

});