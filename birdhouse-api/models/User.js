const connection = require('../config/database');

class User {
  static async findOne(query) {
    try {
      const [rows] = await connection.query('SELECT * FROM users WHERE ?', [query]);
      return rows[0] ? new User(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
