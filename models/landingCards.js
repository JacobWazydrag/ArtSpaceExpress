
const mongoose = require("mongoose");

const landingCardSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        subTitle: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        img: {
            data: Buffer,
            contentType: String
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("LandingCard", landingCardSchema);