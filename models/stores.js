const mongoose = require('mongoose');

const storesSchema = new mongoose.Schema(
    {
        businessNumber: {
            type: String,
            trim: true,
            required: true
        },
        businessName: {
            type: String,
            trim: true,
            required: true
        },
        address: {
            type: String,
            trim: true,
            required: true
        },
        neighborhood: {
            type: String,
            trim: true,
            required: true
        },
        baseRate: {
            type: Number,
            trim: true,
            maxLength: 32,
            required: true
        },
        img: {
            data: Buffer,
            contentType: String,
        },
        hasSpaceRental: {
            type: Boolean,
            required: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Stores', storesSchema);
