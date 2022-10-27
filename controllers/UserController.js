require('dotenv').config();
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const { User, validate } = require('../models/User');
const saltRounds = 10;

const UserSignup = async (req, res) => {
    const { error } = validate(req.body);
    const { name, email, password } = req.body

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        const hashedPwd = await bcrypt.hash(password, saltRounds);
        user = new User({
            name: name,
            email: email,
            password: hashedPwd
        });
        await user.save();
        user.password = null;
        res.send(user);
    }
}

const UserSignin = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({
        email: email
    });

    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }

    return res.json({ token: jwt.sign({ email: user.email, name: user.name, _id: user._id }, process.env.APP_SECRET) });
}

module.exports = { UserSignup, UserSignin };