/*
 * Author:      Nico Berchtold
 * File name:   User.js
 * Version:     1.0
 * Description: Schmea for every Database entry for a User
 *                
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstTime: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('User', UserSchema);
