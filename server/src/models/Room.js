/*
 * Author:      Nico Berchtold
 * File name:   Room.js
 * Version:     1.0
 * Description: Schmea for every Database entry for a Room
 *                
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
    roomName: {
        type: String,
        required: true,
    },
    roomUsersID: [{}],
    roomUsersName: [{}],
    roomDescription: String,
    isGroupchat: {
        type: Boolean,
        required: true,
    },
    createdDate: String,
});

module.exports = mongoose.model('Room', RoomSchema);