const Stores = require('../models/stores');
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
        const { businessNumber, address, neighborhood, baseRate, hasSpaceRental, businessName } = fields;
        const { img } = files;

        if (!businessNumber|| !address || !neighborhood || !baseRate || !hasSpaceRental || !img || !businessName) {
            return res.status(400).json({
                error: 'Please fill required fields'
            });
        }

        let store = new Stores(fields);

        if (files.img) {
            //restrict file size
            if (files.img.size > 1000000) {
                return res.status(400).json({
                    error: 'Image must be smaller than 1mb'
                });
            }
            store.img.data = fs.readFileSync(files.img.path);
            store.img.contentType = files.img.type;
        }
        store.save((err, result) => {
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
        const { businessNumber, address, neighborhood, baseRate, hasSpaceRental, businessName } = fields;
        const { img } = files;

        if (!businessNumber|| !address || !neighborhood || !baseRate || !hasSpaceRental || !img || !businessName) {
            return res.status(400).json({
                error: 'Please fill required fields'
            });
        }

        let store = req.store;
        store = _.extend(store, fields);

        if (files.img) {
            //restrict file size
            if (files.img.size > 1000000) {
                return res.status(400).json({
                    error: 'Image must be smaller than 1mb'
                });
            }
            store.img.data = fs.readFileSync(files.img.path);
            store.img.contentType = files.img.type;
        }
        store.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.storeById = (req, res, next, id) => {
    Stores.findById(id).exec((err, store) => {
        if (err || !store) {
            return res.status(400).json({
                error: 'Store not found'
            });
        }
        req.store = store;
        next();
    });
};

exports.read = (req, res) => {
    req.store.img = undefined;
    return res.json(req.store);
};

exports.remove = (req, res) => {
    let store = req.store;
    store.remove((err, deletedStore) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            deletedStore,
            message: 'Service has been deleted!'
        });
    });
};

// returning sstore by sell = /sstore?sortBy=sold&order=desc&limit4
// returning sstore by arival = /sstore?sortBy=createdAt&order=desc&limit4
//if no params are sent, then all service are returned

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Stores.find()
        .select('-img')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, stores) => {
            if (err) {
                return res.status(400).json({
                    error: 'Stores not found!'
                });
            }
            res.json(stores);
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
            if (key === 'baseRate') {
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

    Stores.find(findArgs)
        .select('-img')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Stores not found!'
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.img = (req, res, next) => {
    if (req.store.img.data) {
        res.set('Content-Type', req.service.img.contentType);
        return res.send(req.service.img.data);
    }
    next();
};
