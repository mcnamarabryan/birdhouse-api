const request = require('supertest');
const { app, port } = require('../../index');

describe('POST /api/login', () => {
  const port = process.env.TEST_PORT || 3001;
  const url = `http://localhost:${port}`;
  
  const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
    done(); // signal that the server is ready
  });

  afterAll((done) => {
    server.close(() => {
      console.log('Server stopped');
      done(); // signal that the server is stopped
    });
  });

  it('returns a JWT token on successful login', async () => {
    const res = await request(url)
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .expect(200);

    expect(res.body.token).toBeDefined();
  });

  it('returns a 401 error if login credentials are invalid', async () => {
    const res = await request(url)
      .post('/api/login')
      .send({ username: 'testuser', password: 'wrongpassword' })
      .expect(401);

    expect(res.body.error).toEqual('Invalid username or password');
  });

  it('returns a 400 error if username or password are missing', async () => {
    const res = await request(url)
      .post('/api/login')
      .send({})
      .expect(400);

    expect(res.body.error).toEqual('Username and password are required');
  });
});
