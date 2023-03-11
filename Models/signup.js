const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone_no:{
        type: String,
        required: true,
        unique: true,
        min: 10
    },
    password:{
        type: String,
        required: true,
        min:8
    },

  });

  const User = mongoose.model('Users',UserSchema);
  module.exports = User