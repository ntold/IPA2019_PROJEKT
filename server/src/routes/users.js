/*
 * Author:      Nico Berchtold
 * File name:   user.js
 * Version:     1.0
 * Description: Redirects every API on /api/user/ request to
 *              the controllers
 *        
 */


// Import all Requirements
const express = require('express');
const router = express.Router();

//Declare RoomController
const UserController = require('../controller/users')

// Requires the auth middleware. Checks befor every Request if a user is allowed
// to take the API call
const checkAuth = require('../middleware/check-auth')

// Register a User
router.post('/register', UserController.users_register_user)

// Login a User
router.post('/login', UserController.users_login_user)

// Get all Users
router.get('/', checkAuth, UserController.users_show_all);

// Get User by ID
router.delete("/:id", checkAuth, UserController.users_delte_user)


// Export the module, to accsess this date from other files
module.exports = router;
