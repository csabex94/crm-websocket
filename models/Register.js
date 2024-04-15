const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const registerSchema = new Schema({
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
    checkHash: {
        type: String,
        required: true
    }
});

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
