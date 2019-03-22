const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    roomID: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    message: String,
    createdDate: String,
});

module.exports = mongoose.model('Message', MessageSchema);
