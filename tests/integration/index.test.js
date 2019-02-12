const request = require('supertest');

describe('index page', () => {
  beforeEach(() => { server = require('../../index') });
  afterEach(async () => {
    await server.close();
  });

  it('should return 200 when going to /', async () => {
    const res = await request(server).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('New Site is up and running')
  })


})