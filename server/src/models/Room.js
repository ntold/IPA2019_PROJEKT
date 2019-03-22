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