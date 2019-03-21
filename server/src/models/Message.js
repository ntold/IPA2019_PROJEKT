const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    roomID: String,
    username: String,
    message: String,
    createdDate: String,
});

module.exports = mongoose.model('Message', MessageSchema);
