const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: String,
    password: String,
    points: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema)