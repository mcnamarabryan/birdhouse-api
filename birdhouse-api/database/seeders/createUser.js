const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Create a MySQL pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Hash a password using bcrypt
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

// Create a user with a hashed password
const createUser = async (username, password) => {
    const hashedPassword = await hashPassword(password);
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        return result.insertId;
    } catch (err) {
        console.error(err);
        throw new Error('Could not create user');
    } finally {
        conn.release();
    }
};

const createTestUsers = async (username, password) => {
    await createUser(username, password);
};


const main = async () => {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        console.error('Usage: node createUser.js <username> <password>');
        process.exit(1);
    }
    
    const [username, password] = args;
    
    try {
        await createTestUsers(username, password);
        console.log('User created');
    } catch (err) {
        console.error(err);
    }
    
    pool.end();
};

main();

