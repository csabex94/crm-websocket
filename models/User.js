const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    tenant: {
        type: Schema.Types.ObjectId,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    device: {
        type: String,
        required: true
    },
    browser: {
        type: String,
        required: true
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;