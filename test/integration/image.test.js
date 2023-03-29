const request = require('supertest');
const app = require('../index');
const fs = require('fs');

describe('POST /api/image', () => {
  it('returns a success message on successful image upload', async () => {
    const res = await request(app)
      .post('/api/image')
      .set('Authorization', 'Bearer <insert token here>')
      .attach('image', 'test/testimage.jpg')
      .expect(200);

    expect(res.body.message).toEqual('Image uploaded');
  });

  it('returns a 401 error if authentication token is invalid or missing', async () => {
    const res = await request(app)
      .post('/api/image')
      .set('Authorization', 'Bearer <insert invalid token here>')
      .attach('image', 'test/testimage.jpg')
      .expect(401);

    expect(res.body.error).toEqual('Invalid token');
  });

  it('returns a 400 error if no image file is attached', async () => {
    const res = await request(app)
      .post('/api/image')
      .set('Authorization', 'Bearer <insert token here>')
      .expect(400);

    expect(res.body.error).toEqual('Image file is required');
  });
});
