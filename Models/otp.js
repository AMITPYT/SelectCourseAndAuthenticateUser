const mongoose = require('mongoose');
const { Schema } = mongoose;

const OtpSchema = new Schema({
    email: String,
    code: String,
    expire: Number

},{
    timestamps: true
})

const otp = new mongoose.model('otp', OtpSchema, 'otp' );
module.exports = otp;