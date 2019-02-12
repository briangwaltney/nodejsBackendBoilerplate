const request = require('supertest');
const { User } = require('../../../models/user');

let server;

describe('requiredRole middleware integration tests', () => {
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
  it('should return 403 if user does not match required role', async () => {
    token = new User({ role: 'user' }).generateAuthToken();
    const res = await exec();
    expect(res.status).toBe(403);
  })
  it('should return 200 if valid token is sent', async () => {
    token = new User({ role: 'admin' }).generateAuthToken();
    const res = await exec();
    expect(res.status).toBe(200);
  })
})