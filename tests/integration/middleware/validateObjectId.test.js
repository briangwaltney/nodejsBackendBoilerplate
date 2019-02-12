const request = require('supertest');
const { User } = require('../../../models/user');
const mongoose = require('mongoose');
let server;

describe('requiredRole middleware integration tests', () => {
  let token;
  let id;
  beforeEach(async () => {
    server = require('../../../index');
    token = new User({ role: 'admin' }).generateAuthToken();
  });
  afterEach(async () => {
    await server.close();
  });

  const exec = () => {

    return request(server)
      .get(`/api/users/${id}`)
      .set('x-auth-token', token)
      .send()
  }
  it('should return 400 if id is not proper ObjectId', async () => {
    id = 'a';
    const res = await exec();
    expect(res.status).toBe(400);
  })
  it('should return 404 if id is in proper format', async () => {
    //indicates id is in the proper format, but doesn't check
    //to see if id is in the database
    id = mongoose.Types.ObjectId();
    const res = await exec();
    expect(res.status).toBe(404);
  })
})