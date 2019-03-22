/*
 * Author:      Nico Berchtold
 * File name:   room.js
 * Version:     1.0
 * Description: Redirects every API on /api/room/ request to
 *              the controllers
 *        
 */


// Import all Requirements
const express = require('express');
const router = express.Router();

// Declare RoomController
const RoomController = require('../controller/rooms')

// Requires the auth middleware. Checks befor every Request if a user is allowed
// to take the API call
const checkAuth = require('../middleware/check-auth')


// Get all Rooms
router.get('/', checkAuth, RoomController.rooms_get_all);

// Get Room by ID
router.get('/:id', checkAuth, RoomController.rooms_get_by_roomID)

//Get Room by Users
router.get('/r/:uid', checkAuth, RoomController.rooms_get_by_user)

// Add new Room
router.post('/', checkAuth, RoomController.rooms_create_room)


// Delete Room
router.delete("/:id", checkAuth, RoomController.rooms_delete_room)


// Export the module, to accsess this date from other files
module.exports = router;
