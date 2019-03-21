/*
 * Author:      Nico Berchtold
 * File name:   rooms.js
 * Version:     1.0
 * Description: Gets the requests from /routes/rooms.js
 *              Stores and Gets data from the DB         
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
        // If no error occured, it sends all rooms in a json file to the client. Status Code 200 means "OK"
        res.status(200).json(rooms);
    })
}

// Gets a Room by a certain ID
exports.rooms_get_by_roomID = (req, res, next) => {
    // .findById in the RoomSchmea
    Room.findById(req.params.id, (err, room) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        res.status(200).json(room);
    })
}

// Gets all Rooms wheres a certain User in it (Its used to only show the user the groups where he's in)
exports.rooms_get_by_user = (req, res, next) => {
    // Searches the match from req.params.uid of "roomUserID" in the Database 
    Room.find({ "roomUsersID": req.params.uid }, (err, rooms) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        res.status(200).json(rooms);
    })
}

// Creates a new Room in the Databse
exports.rooms_create_room = (req, res, next) => {
    // .create creates a new Room with the credentials in req.body
    Room.create(req.body, (err, room) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        console.log(err)
        // If no error occured, it sends a message with the created roomName in it. Status Code 200 means "OK"
        res.status(200).json({
            message: `Room ${room.roomName} created`
        });
    })
}

// Deletes a room
exports.rooms_delete_room = (req, res, next) => {
    // .findByIdAndDelete needs the the RoomID to delete it
    Room.findByIdAndDelete(req.params.id, (err, room) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        // If no error occured, it sends a message. Status Code 200 means "OK"
        res.status(200).json({
            message: "Room deleted"
        });
    })
}