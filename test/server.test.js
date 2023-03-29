const request = require('supertest');
const http = require('http');
const assert = require('assert');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const app = require('../index.js'); 
const port = process.env.TEST_PORT || 6000;
const secretKey = 'secret';

// Create a MySQL pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const query = pool.query.bind(pool);

describe('Birdhouse API', function () {
    let token;
    before(async function () {
        this.timeout(5000);
        const [rows] = await query('SELECT id FROM users WHERE username = ?', ['test']);
        if (rows.length === 0) {
            await query('INSERT INTO users (username, password) VALUES (?, ?)', ['test', 'password']);
        }
        const res = await request(app).post('/login').send({ username: 'test', password: 'password' });
        token = res.body.token;
    });

    after(async function () {
        await query('DELETE FROM images');
        await query('DELETE FROM logs');
        await query('DELETE FROM users');
    });

    describe('POST /login', function () {
        it('should return a token when provided with valid credentials', async function () {
            const res = await request(app).post('/login').send({ username: 'test', password: 'password' });
            assert.equal(res.status, 200);
            assert.ok(res.body.token);
            const decoded = jwt.verify(res.body.token, secretKey);
            assert.equal(decoded.id, 1);
        });
    });

    describe('POST /birdhouse/image', function () {
        it('should upload an image when provided with valid token and data', async function () {
            const res = await request(app).post('/birdhouse/image')
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'image/jpeg')
                .send(Buffer.from('dummydata'));
            assert.equal(res.status, 200);
            const [rows] = await query('SELECT * FROM images');
            assert.equal(rows.length, 1);
            assert.equal(rows[0].filename.substr(0, 6), 'image-');
            assert.equal(rows[0].user_id, 1);
            assert.equal(Buffer.from(rows[0].data).toString(), 'dummydata');
        });
    });

    describe('POST /birdhouse/log', function () {
        it('should save a log message when provided with valid token and message', async function () {
            const res = await request(app).post('/birdhouse/log')
                .set('Authorization', `Bearer ${token}`)
                .send('Test message');
            assert.equal(res.status, 200);
            const [rows] = await query('SELECT * FROM logs');
            assert.equal(rows.length, 1);
            assert.equal(rows[0].user_id, 1);
            assert.equal(rows[0].message, 'Test message');
        });
    });
});
