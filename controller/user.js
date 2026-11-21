const User = require('../models/user');
const { setUser } = require('../service/auth');

async function createUser(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.render('register', { error: 'All fields are required', user: req.user });
        }
        const user = await User.create({
            name, email, password
        });

        const token = setUser(user);
        res.cookie('uid', token);

        return res.redirect('/expense');
    } catch (err) {
        return res.render('register', { error: 'Registration Failed', user: req.user });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('login', { error: 'Please enter both email and password.', user: req.user });
        }
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.render('login', { error: 'Invalid email or password', user: req.user });
        }

        const token = setUser(user);
        res.cookie('uid', token);
        return res.redirect('/expense');
    } catch (error) {
        return res.render('login', { error: 'An error occurred during login', user: req.user });
    }
}

async function logout(req, res) {
    res.clearCookie('uid');
    return res.redirect('/login');
}

module.exports = { createUser, login, logout };
