const mongoose = require('mongoose');
const { Schema } = mongoose;

const verifyemailSchema = new Schema({
    email: String,
    code: String,
    expire: Number,
    

},{
    timestamps: true
})

const otp = new mongoose.model('verifyemailotp', verifyemailSchema, 'verifyemailotp' );
module.exports = otp;