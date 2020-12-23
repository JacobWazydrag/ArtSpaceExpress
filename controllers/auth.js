const User = require('../models/user');
const jwt = require('jsonwebtoken'); //to generate signed token
const expressJwt = require('express-jwt'); //authorization check
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        //hiding salt & hashed pass from response
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {
    //find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: 'User with that email does not exist. Please signup.'
            });
        }
        //if user is found make sure the email and password match
        //create authenticate ethod in User model
        //generate a signed token with userID and secret
        //persist the token as 't' in cookie with expiry date
        //return response with user and token to front end client
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password dont match'
            });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie('t', token, { expire: new Date() + 9999 });
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Signout success' });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'], // added later
    userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
    console.log(req.profile, req.auth, req.profile._id, req.auth._id);
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access Denied!'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role < 3) {
        return res.status(403).json({
            error: 'Admin resource! Access denied!'
        });
    }
    next();
};

exports.isGM = (req, res, next) => {
    if (req.profile.role < 2) {
        return res.status(403).json({
            error: 'GM resource! Access denied!'
        });
    }
    next();
};

exports.isManager = (req, res, next) => {
    if (req.profile.role < 1) {
        return res.status(403).json({
            error: 'Manager resource! Access denied!'
        });
    }
    next();
};
