const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = mysql.createPool(dbConfig);
const User = require('../models/User');

exports.getLogin = async (req, res) => {
  res.render('login');
};

exports.authLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
