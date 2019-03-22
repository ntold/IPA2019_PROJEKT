/*
 * Author:      Nico Berchtold
 * File name:   check-auth.js
 * Version:     1.0
 * Description: Checks if the User is allowed to access Data
 *              with the Token. It decodes the token with the secretKey
 *              
 */

// Import Room Schmea 
const Room = require('../models/Room')

// Imports jsonwebtoken
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        // Gets the Token from the authorization header. Needs to be spilted
        // because its on second place
        const token = req.headers.authorization.split(" ")[1];
        // jwt.verify checks with the secretKey, if the token is correct. 
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        console.log(req.params.id)

        console.log(decoded.userId)

        Room.find()

        // If so, the appliaction can carry on 
        next();
    } catch (error) {
        // If jwt.verify failes, means the token is incorret, the appliaction will deny 
        // access to the database and stops the requiest right here.
        return res.status(401).json({
            message: 'Auth failed, access denied'
        });
    }
};