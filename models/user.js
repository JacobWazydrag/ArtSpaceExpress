const mongo = require('mongoose');
const crypto = require('crypto');
const uuid = require('uuid/v1');


const userSchema = new.mongoose.Schema({
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
    history: {
        type: Array,
        default: []
    }
}, {timestamps: true})
