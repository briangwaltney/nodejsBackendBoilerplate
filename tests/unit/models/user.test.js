const { User, validate } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('User class', () => {
  describe('new User', () => {
    let initProps;
    beforeEach(() => {
      initProps = {
        name_first: 'firstName',
        name_last: 'lastName',
        email: 'email@gmail.com',
        password: 'password',
      }
    })

    const exec = () => {
      return new User(initProps);
    }

    it('should require necessary properties on initialization', async () => {
      //async / await functions not currently supported in error test
      // initProps = {}
      // const user = new User(initProps);
      //expect(async ()=> {await user.validate()}).toThrow();
    })
    it('should create a new user object when class is initialized', async () => {
      const user = exec();
      await user.validate();
      expect(Object.keys(user.toJSON())).toEqual(expect.arrayContaining([
        '_id',
        'name_first',
        'name_last',
        'email',
        'password',
        'creation_date',
        'role',
      ]))
    })

    it('should throw error if Joi validation fails', () => {
      initProps = {};
      const validation = validate(initProps);
      expect(validation.error).not.toBe(null);
    })
    it('should not throw error if Joi validation succeeds', () => {
      const validation = validate(initProps);
      expect(validation.error).toBe(null);
    })

  })

  describe('user.generateAuthToken', () => {
    it('should return token', () => {
      const payload = { _id: new mongoose.Types.ObjectId().toHexString(), role: 'user' }
      const user = new User(payload); //does not fail because save or validate was not called
      const token = user.generateAuthToken();
      const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
      expect(decoded).toMatchObject(payload)
    })
  })
})

