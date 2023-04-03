const connection = require('../config/database');

class Log {
  static async create(data) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO logs SET ?';
      connection.query(query, data, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.insertId);
      });
    });
  }

  // Add other methods as needed
}

module.exports = Log;
