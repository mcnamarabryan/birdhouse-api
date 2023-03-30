const request = require('supertest');
const { app } = require('../../index');
const pool = require('../../utils/db');
const jwt = require('jsonwebtoken');

describe('POST /api/image', () => {
  beforeAll(async () => {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM images WHERE user_id IN (SELECT id FROM users WHERE username = ?)', ['testuser']);
    await conn.query('DELETE FROM users WHERE username = ?', ['testuser']);
    await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', ['testuser', '$2b$10$F2GVx0uvWcXJ/ZsDYsG/fud.JbIjj8toGq3umk0U6uyyU6AbG8CSW']);
    conn.release();
  });

  afterAll(async () => {
    // Delete the test user and their images from the database
    const conn = await pool.getConnection();
    const user = await conn.query('SELECT * FROM users WHERE username = ?', ['testuser']);
    if (user.length > 0) {
      await conn.query('DELETE FROM images WHERE user_id = ?', [user[0].id]);
      await conn.query('DELETE FROM users WHERE username = ?', ['testuser']);
    }
    conn.release();
  });

  it('returns a success message on successful image upload', async () => {
    // Retrieve the test user's ID
    const conn = await pool.getConnection();
    const [[user]] = await conn.query('SELECT * FROM users WHERE username = ?', ['testuser']);
    conn.release();

    // Generate a test access token for the test user
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    const res = await request(app)
      .post('/api/image')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', __dirname + '/image/testimage.jpg')
      .expect(200);

    expect(res.body.message).toEqual('Image uploaded');
  });

  // it('returns a 401 error if authentication token is invalid or missing', async () => {
  //   const res = await request(app)
  //     .post('/api/image')
  //     .set('Authorization', 'Bearer <insert invalid token here>')
  //     .attach('image', __dirname + '/image/testimage.jpg')
  //     .expect(401);

  //   expect(res.body.error).toEqual('Invalid token');
  // });

  // it('returns a 400 error if no image file is attached', async () => {
  //   // Generate a test access token for a user with ID 1
  //   const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);

  //   const res = await request(app)
  //     .post('/api/image')
  //     .set('Authorization', `Bearer ${token}`)
  //     .expect(400);

  //   expect(res.body.error).toEqual('Image file is required');
  // });

  // it('returns a 400 error if file is not an image', async () => {
  //   // Generate a test access token for a user with ID 1
  //   const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);

  //   const res = await request(app)
  //     .post('/api/image')
  //     .set('Authorization', `Bearer ${token}`)
  //     .attach('image', __dirname + '/image/testimage.txt')
  //     .expect(400);

  //   expect(res.body.error).toEqual('File must be an image');
  // });
});
