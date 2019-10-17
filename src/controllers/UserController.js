const User = require('../models/User');

module.exports = {
    async index(req, res) {
        const users = await User.find().sort('-createdAt');

        return res.json(users);
    },

    async store(req, res) {
        const { login, password } = req.body;

        const user = await User.create({
            login,
            password
        });

        req.io.emit('user', user);

        return res.json(user);
    },

    async delete(req, res) {
        const user = await User.findById(req.params.id);

        await user.remove();

        return res.send();
    }
}  