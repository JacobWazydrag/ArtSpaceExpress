const Artist = require('../models/artist');

exports.artistById = (req, res, next, id) => {
    Artist.findById(id).exec((err, artist) => {
        if (err || !artist) {
            return res.status(400).json({
                error: 'Artist not found'
            });
        }
        req.profile = artist;
        next();
    });
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.update = (req, res) => {
    Artist.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (err, artist) => {
        if (err) {
            return res.status(400).json({
                error: 'You are not authorized to perform this action!'
            });
        }
        req.profile.hashed_password = undefined;
        artist.salt = undefined;
        res.json(artist);
    });
};
