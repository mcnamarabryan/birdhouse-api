const connection = require('../config/database');

class User {
  static async findOne(condition) {
    return new Promise((resolve, reject) => {
      const where = Object.entries(condition)
        .map(([key, value]) => `${key} = ${connection.escape(value)}`)
        .join(' AND ');

      const query = `SELECT * FROM users WHERE ${where} LIMIT 1`;

      connection.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }

        if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      });
    });
  }
}

module.exports = User;
