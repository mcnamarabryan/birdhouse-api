const request = require('supertest');
const app = require('../index');

describe('POST /api/log', () => {
  it('returns a success message on successful log message submission', async () => {
    const res = await request(app)
      .post('/api/log')
      .set('Authorization', 'Bearer <insert token here>')
      .send('Test log message')
      .expect(200);

    expect(res.body.message).toEqual('Log message saved');
  });

  it('returns a 401 error if authentication token is invalid or missing', async () => {
    const res = await request(app)
      .post('/api/log')
      .set('Authorization', 'Bearer <insert invalid token here>')
      .send('Test log message')
      .expect(401);

    expect(res.body.error).toEqual('Invalid token');
  });

  it('returns a 400 error if log message is missing', async () => {
    const res = await request(app)
      .post('/api/log')
      .set('Authorization', 'Bearer <insert token here>')
      .expect(400);

    expect(res.body.error).toEqual('Log message is required');
  });
});
