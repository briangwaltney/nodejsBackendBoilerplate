const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const Joi = require('joi');
const validateBody = require('../middleware/validateBody')


router.post('/', validateBody(validator), async (req, res) => {

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email or password incorrect');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Email or password incorrect');

  const token = await user.generateAuthToken();
  return res.header('x-auth-token', token).send({ token });
})

function validator(user) {
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(8).max(255).required(),
  };
  return Joi.validate(user, schema);
}

module.exports = router;