const LandingCard = require('../models/landingCards');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        //check for all fields
        const { title, subTitle } = fields;
        const { img } = files;

        if (!title || !subTitle || !img) {
            return res.status(400).json({
                error: 'Please fill required fields'
            });
        }

        let landingCard = new LandingCard(fields);
        if (files.img) {
            //restrict file size
            if (files.img.size > 1000000) {
                return res.status(400).json({
                    error: 'Image must be smaller than 1mb'
                });
            }
            landingCard.img.data = fs.readFileSync(files.img.path);
            landingCard.img.contentType = files.img.type;
        }
        landingCard.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err.message
                });
            }
            res.json(result);
        });
    });
};

exports.landingCardById = (req, res, next, id) => {
    LandingCard.findById(id).exec((err, landingCard) => {
        if (err || !landingCard) {
            return res.status(400).json({
                error: 'Landing Card does not exist'
            });
        }
        req.landingCard = landingCard;
        next();
    });
};

exports.list = (req, res) => {
    LandingCard.find()
        .select('-img')
        .exec((err, landingCards) => {
            if (err) {
                return res.status(400).json({
                    error: 'landingCards not found!'
                });
            }
            res.json(landingCards);
        });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        //check for all fields
        const { title, subTitle} = fields;
        const { img } = files;

        if (!title || !subTitle || !img) {
            return res.status(400).json({
                error: 'Please fill required fields'
            });
        }

        let landingCard = req.landingCard;
        landingCard = _.extend(landingCard, fields);

        if (files.img) {
            //restrict file size
            if (files.img.size > 1000000) {
                return res.status(400).json({
                    error: 'Image must be smaller than 1mb'
                });
            }
            landingCard.img.data = fs.readFileSync(files.img.path);
            landingCard.img.contentType = files.img.type;
        }
        landingCard.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};