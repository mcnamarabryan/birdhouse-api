const request = require('supertest');
const { app, port } = require('../../index');

describe('POST /api/log', () => {
  const port = process.env.TEST_PORT || 3001;
  const url = `http://localhost:${port}`;

  let server;

  beforeAll((done) => {
    server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      done(); // signal that the server is ready
    });
  });

  afterAll((done) => {
    server.close(() => {
      console.log('Server stopped');
      done(); // signal that the server is stopped
    });
  });
  
  it('returns a success message on successful log message submission', async () => {
    const res = await request(url)
      .post('/api/log')
      .set('Authorization', 'Bearer <insert token here>')
      .send('Test log message')
      .expect(200);

    expect(res.body.message).toEqual('Log message saved');
  });

  it('returns a 401 error if authentication token is invalid or missing', async () => {
    const res = await request(url)
      .post('/api/log')
      .set('Authorization', 'Bearer <insert invalid token here>')
      .send('Test log message')
      .expect(401);

    expect(res.body.error).toEqual('Invalid token');
  });

  it('returns a 400 error if log message is missing', async () => {
    const res = await request(url)
      .post('/api/log')
      .set('Authorization', 'Bearer <insert token here>')
      .expect(400);

    expect(res.body.error).toEqual('Log message is required');
  });
});
