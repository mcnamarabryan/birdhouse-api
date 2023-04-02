const multer = require('multer');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/db');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const pool = mysql.createPool(dbConfig);

exports.uploadImage = async (req, res) => {
  try {
    const { user_id } = req.body;
    const file = req.file;

    if (!user_id || !file) {
      return res.status(400).json({ message: 'Both user_id and image are required.' });
    }

    const filename = file.originalname;
    const data = file.buffer.toString('base64');

    const [result] = await pool.query('INSERT INTO images (filename, user_id, data) VALUES (?, ?, ?)', [filename, user_id, data]);

    res.status(201).json({ message: 'Image uploaded successfully.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image.', error });
  }
};

exports.multerUpload = upload.single('image');
