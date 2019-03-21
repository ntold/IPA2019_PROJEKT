/*
 * Author:      Nico Berchtold
 * File name:   users.js
 * Version:     1.0
 * Description: Registers a User in the Database and hashes password
 *              Logs a user in  
 *              
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

// Gives the User a JSONWebtoken
exports.users_login_user = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth failed, wrong Username or Password'
                })
            } else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Auth failed, wrong Username or Password'
                        })
                    }
                    if (result) {
                        const token = jwt.sign({
                            username: user.username,
                            userId: user._id
                        },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            }
                        );
                        res.status(200).json({
                            message: "Auth succ",
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

exports.users_show_add = (req, res, next) => {
    User.find((err, users) => {
        if (err) {
            return next(err)
        } else {
            res.status(200).json(users)
        }
    })
}