const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

const pool = mysql.createPool(dbConfig);

exports.getMessage = async (req, res) => {
  res.render('index');
}

exports.postMessage = async (req, res) => {
  const { user_id, message } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ error: 'user_id and message are required' });
  }

  try {
    const [result] = await pool.query('INSERT INTO logs (user_id, message) VALUES (?, ?)', [user_id, message]);
    res.status(201).json({ message: 'Message added to the log', log_id: result.insertId });
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({ error: 'An error occurred while posting the message' });
  }
};
