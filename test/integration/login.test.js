const request = require('supertest');
const app = require('../index');

describe('POST /api/login', () => {
  it('returns a JWT token on successful login', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .expect(200);

    expect(res.body.token).toBeDefined();
  });

  it('returns a 401 error if login credentials are invalid', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'wrongpassword' })
      .expect(401);

    expect(res.body.error).toEqual('Invalid username or password');
  });

  it('returns a 400 error if username or password are missing', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({})
      .expect(400);

    expect(res.body.error).toEqual('Username and password are required');
  });
});
