const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../../models/user');
const bcrypt = require('bcrypt');
let server;

describe('/api/users', () => {
  beforeEach(async () => {
    server = require('../../../index');
  });
  afterEach(async () => {
    await server.close();
    await User.deleteMany({});
  });

  describe('/GET', () => {
    let user;
    beforeEach(async () => {
      user = new User({
        name_first: 'firstName',
        name_last: 'lastName',
        email: 'email@gmail.com',
        password: 'password',
      });
      await user.save();
      role = 'admin';
      token = new User({ role }).generateAuthToken();
    })

    afterEach(async () => {
      await User.deleteMany({})
      await server.close()
    })
    let token;
    let role;
    const exec = () => {
      return request(server)
        .get(`/api/users/`)
        .set('x-auth-token', token)
        .send()
    }
    it('should return 400 if bad token is provided', async () => {
      token = 'a';
      const res = await exec();
      expect(res.status).toBe(400);
    })
    it('should return 401 if user not logged in', async () => {
      token = ''
      const res = await exec();
      expect(res.status).toBe(401);
    })
    it('should return 403 if not admin', async () => {
      token = new User({ role: 'user' }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    })
    it('should return 200 if request is valid', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    })
    it('should return list of all users if request is valid', async () => {
      user2 = new User({ name_first: 'firstName2', name_last: 'lastName2', email: 'email2@gmail.com', password: 'password', });
      await user2.save();
      const res = await exec();
      expect(res.body.length).toBe(2);
      expect(res.body.some(u => u.name_last == 'lastName')).toBeTruthy();
      expect(res.body.some(u => u.name_last == 'lastName2')).toBeTruthy();
    })
  })
  describe('/GET/:id', () => {
    let user;
    let id;
    let token;
    let role;
    beforeEach(async () => {
      user = new User({
        name_first: 'firstName',
        name_last: 'lastName',
        email: 'email@gmail.com',
        password: 'password',
      });
      await user.save();
      id = user._id;
      role = 'admin';
      token = new User({ role }).generateAuthToken();
    })

    afterEach(async () => {
      await User.deleteMany({})
    })

    const exec = () => {
      return request(server)
        .get(`/api/users/${id}`)
        .set('x-auth-token', token)
        .send()
    }
    it('should return 400 if bad token is provided', async () => {
      token = 'a';
      const res = await exec();
      expect(res.status).toBe(400);
    })
    it('should return 400 if bad id is provided', async () => {
      id = 'a';
      const res = await exec();
      expect(res.status).toBe(400);
    })

    it('should return 401 if user not logged in', async () => {
      token = ''
      const res = await exec();
      expect(res.status).toBe(401);
    })
    it('should return 403 if not admin', async () => {
      token = new User({ role: 'user' }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    })
    it('should return 404 if user does not exist', async () => {
      id = mongoose.Types.ObjectId()
      const res = await exec();
      expect(res.status).toBe(404);
    })
    it('should return 200 if request is valid', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    })
    it('should return user data if request is valid', async () => {
      const res = await exec();
      expect(res.body._id).toBeDefined();
      expect(res.body.name_last).toBe('lastName');
      expect(res.body.name_first).toBe('firstName');
      expect(res.body.role).toBe('user');
    })
  })

  describe('/POST', () => {
    let body;
    beforeEach(async () => {
      body = {
        name_last: 'lastName',
        name_first: 'firstName',
        email: 'email@email.com',
        password: 'password',
      }
    })

    afterEach(async () => {
      await User.deleteMany({});
    })
    const exec = () => {
      return request(server)
        .post('/api/users')
        .send(body)
    }
    it('should return 400 if user validation fails', async () => {
      body = {}
      const res = await exec();
      expect(res.status).toBe(400)
    })
    it('should return 400 if user already exists', async () => {
      user = new User(body);
      await user.save();
      const res = await exec();
      expect(res.status).toBe(400);
    })
    it('should return 200 if body is validated', async () => {
      const res = await exec();
      expect(res.status).toBe(200)
    })
    it('should return the new user in the response', async () => {
      const res = await exec();
      expect(res.body.name_last).toBe(body.name_last);
      expect(res.body.name_first).toBe(body.name_first);
      expect(res.body.email).toBe(body.email);
      expect(res.body._id).toBeDefined();
    })
    it('should hash the password', async () => {
      const res = await exec();
      const user = await User.findById(res.body._id)
      const validPassword = await bcrypt.compare(body.password, user.password)
      expect(validPassword).toBeTruthy()
    })
    it('log the user in after creation', async () => {
      const res = await exec();
      expect(res.header['x-auth-token']).toBeDefined();
    })

  })

})