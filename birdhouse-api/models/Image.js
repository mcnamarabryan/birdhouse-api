const connection = require('../config/database');

class Image {
  static async create(data) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO images SET ?';
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

module.exports = Image;
