const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid');

const artistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxLength: 16
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        about: {
            type: String,
            trim: true
        },
        salt: String,
        role: {
            type: Number,
            default: 0
        },
        isArtist: {
            type: Boolean,
            default: true,
            required: true
        },
        stores: {
            type: ObjectId,
            ref: 'Stores',
            required: true
        },
        availability: {
            type: Array,
            default: []

        },
        history: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
);

artistSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        console.log(this.salt);
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

artistSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        } catch (err) {
            return '';
        }
    }
};

module.exports = mongoose.model('Artist', artistSchema);
