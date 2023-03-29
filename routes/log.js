const express = require('express');
const pool = require('../utils/db');
const { checkToken } = require('../utils/token');

const router = express.Router();
const bodyParser = require('body-parser');

router.post('/api/log', checkToken, bodyParser.text(), async (req, res) => {
  const userId = req.userId;
  const message = req.body;
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query('INSERT INTO logs (user_id, message) VALUES (?, ?)', [userId, message]);
    res.json({ message: 'Log message saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release();
  }
});

module.exports = router;
