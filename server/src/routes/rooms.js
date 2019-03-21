// Import all Requirements
const express = require('express');
const router = express.Router();

// Requires the auth middleware
// const checkAuth = require('../middleware/check-auth')

// Declare RoomController
const RoomController = require('../controller/rooms')

// Get all Rooms
router.get('/', RoomController.rooms_get_all);

// Get Room by ID
router.get('/:id', RoomController.rooms_get_by_roomID)

//Get Room by Users
router.get('/r/:uid', RoomController.rooms_get_by_user)

// Add new Room
router.post('/', RoomController.rooms_create_room)


// Delete Room
router.delete("/:id", RoomController.rooms_delete_room)


module.exports = router;
