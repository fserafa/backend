const User = require('../models/User');

module.exports = {
    async store(req, res) {
        const user = await User.findById(req.params.id);

        user.points += 1;

        await user.save();

        req.io.emit('point', user);

        return res.json(user);
    }
};  