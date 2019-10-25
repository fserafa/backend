const User = require('../models/User');
const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = {
    async index(req, res) {
        const users = await User.find()
            .populate('posts')
            .sort({ points: -1 })

 
        return res.json(users);
    },

    async getById(req, res) {
        const user = await User.findById(req.params.id)
            .populate('posts') 
            .sort('-createdAt');

        user.posts = user.posts.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

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
        const { author, authorId, place, description, hashtags } = req.body;
        const { filename: image } = req.file;
        
        const user = await User.findById(req.params.id);

        const [name] = image.split('.');
        const fileName = `${name}.jpg`;

        await sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 70 })
            .toFile(
                path.resolve(req.file.destination, 'resized', fileName)
            )

        fs.unlinkSync(req.file.path);

        const post = await Post.create({
            author,
            authorId,
            place,
            description,
            hashtags,
            image: fileName,
        });

        user.posts = [...user.posts, post]

        await user.save();

        req.io.emit('newPost', post);

        return res.json(user);
    },

    async delete(req, res) {
        const user = await User.findById(req.params.id);

        await user.remove();

        return res.send();
    }
}  