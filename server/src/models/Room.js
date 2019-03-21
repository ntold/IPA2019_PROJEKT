var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
    roomName: String,
    roomUsersID: [{}],
    roomUsersName: [{}],
    roomDescription: String,
    isGroupchat: Boolean,
    createdDate: String,
});

module.exports = mongoose.model('Room', RoomSchema);