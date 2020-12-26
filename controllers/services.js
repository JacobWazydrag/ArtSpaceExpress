const Services = require('../models/services');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { EPROTONOSUPPORT } = require('constants');
const services = require('../models/services');

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
        const { name, price, category, description } = fields;
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
            message: 'Service has been deleted!'
        });
    });
};

// returning services by sell = /services?sortBy=sold&order=desc&limit4
// returning services by arival = /services?sortBy=createdAt&order=desc&limit4
//if no params are sent, then all service are returned

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Services.find()
        .select('-img')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, services) => {
            if (err) {
                return res.status(400).json({
                    error: 'Services not found!'
                });
            }
            res.json(services);
        });
};

//get the services based on the requested service category
exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Services.find({ _id: { $ne: req.service }, category: req.service.category })
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, services) => {
            if (err) {
                return res.status(400).json({
                    error: 'Service not found!'
                });
            }
            res.json(services);
        });
};

exports.listCategories = (req, res) => {
    Services.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: 'Service not found!'
            });
        }
        res.json(categories);
    });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Services.find(findArgs)
        .select('-img')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Services not found!'
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.img = (req, res, next) => {
    if (req.service.img.data) {
        res.set('Content-Type', req.service.img.contentType);
        return res.send(req.service.img.data);
    }
    next();
};
