const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const servicesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            maxLength: 32,
            required: true
        },
        description: {
            type: String,
            maxLength: 2000,
            required: true
        },
        term: {
            type: String,
            trim: true,
            maxLength: 32,
            required: false
        },
        duration: {
            type: String,
            trim: true,
            maxLength: 32,
            required: false
        },
        availablitiy: {
            type: String,
            trim: true,
            required: false
        },
        discipline: {
            type: String,
            trim: true,
            maxLength: 32,
            required: false
        },
        img: {
            data: Buffer,
            contentType: String,
        },
        price: {
            type: Number,
            trim: true,
            maxLength: 32,
            required: true
        },
        category: {
            type: ObjectId,
            ref: 'Category',
            maxlength: 32,
            required: true
        },
        shipping: {
            type: Boolean,
            required: false
        },
        isVirtual: {
            type: Boolean,
            required: false
        },
        isSpaceRental: {
            type: Boolean,
            required: false
        },
        isProduct: {
            type: Boolean,
            required: false
        },
        quantity: {
            type: Number,
            required: false
        },
        sold: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Services', servicesSchema);
