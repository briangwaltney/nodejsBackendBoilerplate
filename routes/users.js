const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requiredRole = require('../middleware/requiredRole');
const { User, validate } = require('../models/user');
const validateObjectId = require('../middleware/validateObjectId');
const validateBody = require('../middleware/validateBody');

router.get('/', [auth, requiredRole('admin')], async (req, res) => {
  const users = await User.find();
  return res.send(users)
});

router.get('/:id', [auth, requiredRole('admin'), validateObjectId], async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('User not found')
  return res.send(user)
});

router.post('/', validateBody(validate), async (req, res) => {
  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send('User already registered.');
  user = await new User(_.pick(req.body, ['name_last', 'name_first', 'email', 'password', 'gender', 'age', 'weight', 'height']))
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.save()
  let token = await user.generateAuthToken();
  return res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(_.pick(user, [
      '_id',
      'name_last',
      'name_first',
      'email'
    ]))
})

module.exports = router;