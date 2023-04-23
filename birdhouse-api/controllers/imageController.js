const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const pool = require('../config/database');

//hardcode user_id for now
const user_id = 1;

exports.getImage = async (req, res) => {
  res.render('index')
}

exports.postImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Image is required.' });
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
