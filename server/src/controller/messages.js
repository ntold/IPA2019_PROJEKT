/*
 * Author:      Nico Berchtold
 * File name:   message.js
 * Version:     1.0
 * Description: 
 *              
 *              
 */

// imports Messageschema for mongoose 
const Message = require('../models/Message')

// Gets all Messages from the Database
exports.messages_get_all = (req, res, next) => {
    // .find shows every entry for the MessageSchme
    Message.find((err, products) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        res.status(200).json(products);
    })
}

exports.messages_get_by_roomID = (req, res, next) => {
    Message.find({ roomID: req.params.roomid }, (err, post) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        res.status(200).json(post);
    })
}

exports.messages_create_message = (req, res, next) => {
    Message.create(req.body, (err, post) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        res.status(200).json({
            message: "Message Sent!"
        });
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