const request = require('supertest');
let server;
let body;
describe('requiredRole middleware integration tests', () => {
  beforeEach(async () => {
    server = require('../../../index');
    body = {
      name_first: 'firstName',
      name_last: 'lastName',
      email: 'email@email.com',
      password: 'password',
    }
  });
  afterEach(async () => {
    await server.close();
  });
  const exec = () => {
    return request(server)
      .post(`/api/users/`)
      .send(body)
  }
  it('should return 400 if body content does not validate', async () => {
    body = {};
    const res = await exec();
    expect(res.status).toBe(400);
  })
  it('should return 200 if body is validated', async () => {

    const res = await exec();
    expect(res.status).toBe(200);
  })
})