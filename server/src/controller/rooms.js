/*
 * Author:      Nico Berchtold
 * File name:   room.js
 * Version:     1.0
 * Description: 
 *              
 *              
 */

// imports Roomschema for mongoose 
const Room = require('../models/Room')

// Gets all Rooms from the Database
exports.rooms_get_all = (req, res, next) => {
    // .find shows every entry which matches the RoomSchema
    Room.find((err, rooms) => {
        if (err) {
            // Error with Statuscode 500, means "Internal Server Error"
            res.status(500).json({
                error: err
            });
        };
        // If no error occured, it sends all rooms in a json file. Status Code 200 means, "OK"
        res.status(200).json(rooms);
    })
}

exports.rooms_get_by_roomID = (req, res, next) => {
    Room.findById(req.params.id, (err, room) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        res.status(200).json(room);
    })
}

exports.rooms_get_by_user = (req, res, next) => {
    Room.find({ "roomUsersID": req.params.uid }, (err, rooms) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        res.status(200).json(rooms);
    })
}

exports.rooms_create_room = (req, res, next) => {
    Room.create(req.body, (err, room) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        console.log(err)
        res.status(200).json({
            message: `Room ${room.roomName} created`
        });
    })
}

exports.rooms_delete_room = (req, res, next) => {
    Room.findByIdAndDelete(req.params.id, req.body, (err, room) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        res.status(200).json({
            message: "Room deleted"
        });
    })
}