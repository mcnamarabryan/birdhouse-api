const express = require('express');
const multer = require('multer');
const pool = require('../utils/db');
const { checkToken } = require('../utils/token');

const router = express.Router();
const upload = multer();

router.post('/api/image', checkToken, upload.single('image'), async (req, res) => {
  const userId = req.userId;
  const data = req.file.buffer;
  const filename = `image-${Date.now()}.jpg`;
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query('INSERT INTO images (filename, user_id, data) VALUES (?, ?, ?)', [filename, userId, data]);
    res.json({ message: 'Image uploaded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release();
  }
});

module.exports = router;
