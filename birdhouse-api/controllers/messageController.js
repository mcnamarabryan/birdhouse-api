const pool = require('../config/database');

exports.getMessage = async (req, res) => {
  res.render('index');
}

exports.postMessage = async (req, res) => {
  const { user_id, log } = req.body;

  if (!user_id || !log) {
    return res.status(400).json({ error: 'user_id and log are required' });
  }

  try {
    const [result] = await pool.query('INSERT INTO logs (user_id, log) VALUES (?, ?)', [user_id, log]);
    res.status(201).json({ log: 'Message added to the log', log_id: result.insertId });
  } catch (error) {
    console.error('Error posting log:', error);
    res.status(500).json({ error: 'An error occurred while posting the log' });
  }
};
