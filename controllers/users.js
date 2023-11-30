const e = require('connect-flash');
const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Khmer Food!');
            res.redirect('/home');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const user = req.user;
    if (user.id === '655b2158c89efc6590c4012d') {
        res.redirect('/tbalkhmers');
    }else if(user.id === '655f2acdfa47605c348091d3'){
        res.redirect('/meatuphums');
    }else if(user.id === '656826beb627522488c1dfa0') {
        res.redirect('/khmerfoods');
    } else{
        res.redirect('/home');
    }
}

module.exports.logout = (req, res) => {
    req.logout();
    // req.session.destroy();
    req.flash('success', "Goodbye!");
    res.redirect('/');
}