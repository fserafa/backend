const mongoose = require('mongoose');
const PostSchema = require('./Post');

const UserSchema = new mongoose.Schema({
    name: String,
    login: String,
    password: String,
    profilePicture: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Post',
    }],
    points: {
        type: Number,
        default: 0
    } 
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema)  