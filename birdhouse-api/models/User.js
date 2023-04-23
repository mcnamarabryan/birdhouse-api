const connection = require('../config/database');

class User {
  
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
  }

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
