const mysql = require('mysql2/promise');
const dbConfig = require('../config/db');

const pool = mysql.createPool(dbConfig);

exports.getLogin = async (req, res) => {
  res.render('login');
};
