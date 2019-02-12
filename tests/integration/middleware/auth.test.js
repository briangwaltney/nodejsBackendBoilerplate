
const request = require('supertest');
const { User } = require('../../../models/user');

let server;

describe('auth middleware integration tests', () => {
  beforeEach(async () => {
    server = require('../../../index');
  });
  afterEach(async () => {
    await server.close();
  });
  let token;
  const exec = () => {
    return request(server)
      .get(`/api/users/`)
      .set('x-auth-token', token)
      .send()
  }
  it('should return 401 if no token is sent', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  })
  it('should return 400 if token is invalid', async () => {
    token = 'a';
    const res = await exec();
    expect(res.status).toBe(400);
  })
  it('should return 200 if valid token is sent', async () => {
    token = new User({ role: 'admin' }).generateAuthToken();
    const res = await exec();
    expect(res.status).toBe(200);
  })
})