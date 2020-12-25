const Services = require('../models/services');
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
        const { name, price, category, description } = fields;
        const { img } = files;

        if (!name || !price || !category || !description || !img) {
            return res.status(400).json({
                error: 'Please fill required fields'
            });
        }

        let service = new Services(fields);

        if (files.img) {
            //restrict file size
            if (files.img.size > 1000000) {
                return res.status(400).json({
                    error: 'Image must be smaller than 1mb'
                });
            }
            service.img.data = fs.readFileSync(files.img.path);
            service.img.contentType = files.img.type;
        }
        service.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
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
        const { name, price, category, description} = fields;
        const { img } = files;

        if (!name || !price || !category || !description || !img) {
            return res.status(400).json({
                error: 'Please fill required fields'
            });
        }

        let service = req.service;
        service = _.extend(service, fields);

        if (files.img) {
            //restrict file size
            if (files.img.size > 1000000) {
                return res.status(400).json({
                    error: 'Image must be smaller than 1mb'
                });
            }
            service.img.data = fs.readFileSync(files.img.path);
            service.img.contentType = files.img.type;
        }
        service.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.serviceById = (req, res, next, id) => {
    Services.findById(id).exec((err, service) => {
        if (err || !service) {
            return res.status(400).json({
                error: 'Service not found'
            });
        }
        req.service = service;
        next();
    });
};

exports.read = (req, res) => {
    req.service.img = undefined;
    return res.json(req.service);
};

exports.remove = (req, res) => {
    let service = req.service;
    service.remove((err, deletedService) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            deletedService,
            message: 'Service has been deleted'
        });
    });
};
