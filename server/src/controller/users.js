/*
 * Author:      Nico Berchtold
 * File name:   users.js
 * Version:     1.0
 * Description: Registers a User in the Database and hashes password
 *              Gives the User a JWT (=JSONWebtoken), for full access to
 *              the Database
 */

// imports Messageschema for mongoose 
const User = require('../models/User')

// Imports hashing algorithmus 
const bcrypt = require('bcrypt')
// Imports JSONWebtokens 
const jwt = require('jsonwebtoken')

// Checks if a Username is already taken, if not it hashes the password
// and stores it to the database
exports.users_register_user = (req, res, next) => {
    // First, check if the Username is taken
    User.find({ username: req.body.username })
        .then(user => {
            if (user.length >= 1) {
                // If so, it sends an error message back to the client
                // Statuscode 409 means "Conflict"
                return res.status(409).json({
                    message: "Username exists"
                })
            } else {
                // If not, it hashes the password using bcrypt.
                // The first parameter is the password from the client and the
                // second is the cost factor (salting round). 
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    // if it fails, it sends back an error with statuscode 500, means "Internal Server Error"
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        // If there is no error with the password, its gonna create the new users
                        // and stores it. 
                        const user = new User({
                            username: req.body.username,
                            password: hash
                        })
                        user
                            .save()
                            .then(
                                result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: "User created"
                                    });
                                }
                            )
                    }
                })
            }
        }
        )
}

// First, it checks if the User do exist, then it compares the hashed verion of
// both passwords. If they match each othe, the user will get a JSONWebtoken
exports.users_login_user = (req, res, next) => {
    // Checks if user exists
    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth failed, wrong Username or Password'
                })
            } else {
                // Compares both Hashes Passwords and replies true or false
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Auth failed, wrong Username or Password'
                        })
                    }
                    if (result) {
                        // Generates the JWT with the Username and the UserID, combiend with a
                        // secret Key. The token will expire in 1 houre.
                        const token = jwt.sign({
                            username: user.username,
                            userId: user._id
                        }, process.env.JWT_KEY, { expiresIn: "1h" }
                        );
                        // Sends the token back to the client
                        res.status(200).json({
                            message: "Auth successful",
                            token: token,
                            username: user.username,
                            userID: user._id
                        });

                    } else {
                        return res.status(401).json({
                            message: 'Auth failed, wrong Username or Password'
                        })
                    }
                })
            }
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({
                error: err
            })
        })
}
// Gets all users
exports.users_show_all = (req, res, next) => {
    User.find((err, users) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        res.status(200).json(users)

    })
}

// Deletes a User by ID
exports.users_delte_user = (req, res, next) => {
    // .findByIdAndRemove needs the the userID to delete it
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        // If no error occured, it sends a message. Status Code 200 means "OK"
        res.status(200).json({
            message: "User deleted"
        });
    })
}