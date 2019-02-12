const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
require('joi-objectid');

const userSchema = new mongoose.Schema({

  name_first: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  name_last: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxlength: 1024
  },
  role: {
    type: String,
    enum: ['user', 'coach', 'admin'],
    required: true,
    default: 'user',
    minLength: 3,
    maxlength: 55,
  },
  creation_date: {
    type: Date,
    default: Date.now(),
    required: true
  },
  height: {
    type: Number,
    maxlength: 4
  },
  weight: {
    type: Number,
    maxlength: 4
  },
  age: {
    type: Number,
    maxlength: 3
  },
  gender: {
    type: String,
    minlength: 4,
    maxlength: 6
  }
})

userSchema.methods.generateAuthToken = function () { //cannot use arrow function with "this"
  return jwt.sign({
    _id: this._id,
    role: this.role,
  }, config.get('jwtPrivateKey'))
}

const User = mongoose.model('User', userSchema, 'users'); //creates Class database

function validateUser(user) {
  const schema = {
    name_first: Joi.string().min(5).max(50).required(),
    name_last: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(8).max(255).required(),
    creation_date: Joi.date(),
    gender: Joi.string().min(4).max(5),
    age: Joi.number().max(3),
    weight: Joi.number().max(3),
    role: Joi.string().max(55),
    height: Joi.number().max(3),
  };
  return Joi.validate(user, schema);
}
exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;