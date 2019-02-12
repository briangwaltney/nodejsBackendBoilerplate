const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../../models/user');
const bcrypt = require('bcrypt');
let server;



describe('/api/auth', () => {
  beforeEach(async () => {
    server = require('../../../index');
    await User.deleteMany({});
  });
  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });
  let token;
  let body;
  let user;
  beforeEach(async () => {
    token = '';
    body = {
      email: 'email@email.com',
      password: 'passwordStronger'
    }
    user = new User({
      name_last: 'lastName',
      name_first: 'firstName',
      email: 'email@email.com',
      password: 'passwordStronger'
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    token = await user.generateAuthToken();
  })
  const exec = () => {
    return request(server)
      .post('/api/auth')
      .set('x-auth-token', token)
      .send(body)
  }
  it('should return 400 if input is not email and password', async () => {
    body = {}
    const res = await exec();
    expect(res.status).toBe(400);
  })
  it('should return 400 if user is not in database', async () => {
    body = { email: 'wrong@email.com', password: 'password' }
    const res = await exec();
    expect(res.status).toBe(400);
  })
  it('should return 400 if password is incorrect', async () => {
    body = { email: 'email@email.com', password: 'wrongPassword' }
    const res = await exec();
    expect(res.status).toBe(400);
  })
  it('should set header token if email and password are validated', async () => {
    const res = await exec();
    expect(res.header['x-auth-token']).toBe(token);
  })
  it('should return token if email and password are validated', async () => {
    const res = await exec();
    expect(res.body.token).toBe(token);
  })
})