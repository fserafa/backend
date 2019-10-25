const User = require('../models/User');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = {
    async index(req, res) {
        const users = await User.find().sort({ points: -1 });

        return res.json(users);
    },

    async getById(req, res) {
        const user = await User.findById(req.params.id);

        return res.json(user);
    },

    async store(req, res) {
        const { login, password, name } = req.body;
        const { filename: profilePicture } = req.file;

        const [fname] = profilePicture.split('.');
        const fileName = `${fname}.jpg`;

        await sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 70 })
            .toFile(
                path.resolve(req.file.destination, 'resized', fileName)
            )

        fs.unlinkSync(req.file.path);

        const user = await User.create({
            login,
            password,
            name,
            profilePicture: fileName
        });

        req.io.emit('user', user);

        return res.json(user);
    },

    async newPost(req, res) {
        const user = await User.findById(req.params.id);

        user.posts = req.body.Post

        await user.save();

        req.io.emit('newPost', user);

        return res.json(user);
    },

    async editUser(req, res) {
        const { name } = req.body;
        const { filename: profilePicture } = req.file;

        const user = await User.findById(req.params.id);

        const [fname] = profilePicture.split('.');
        const fileName = `${fname}.jpg`;

        await sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 70 })
            .toFile(
                path.resolve(req.file.destination, 'resized', fileName)
            )

        fs.unlinkSync(req.file.path);

        user.name = name
        user.profilePicture = { profilePicture: fileName }

        await user.save();

        req.io.emit('update', user);

        return res.json(user);
    },

    async delete(req, res) {
        const user = await User.findById(req.params.id);

        await user.remove();

        return res.send();
    }
}  