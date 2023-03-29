const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const router = express.Router();

const saltRounds = 10;
const secretKey = process.env.JWT_SECRET;

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

// Hash a password using bcrypt
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// Create a user with a hashed password
const createUser = async (username, password) => {
  const hashedPassword = await hashPassword(password);
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    return result.insertId;
  } catch (err) {
    console.error(err);
    throw new Error('Could not create user');
  } finally {
    conn.release();
  }
};

// Route for user registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const userId = await createUser(username, password);
    const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for user authentication
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT id, password FROM users WHERE username = ?', [username]);
    if (rows.length === 0)
