const path = require('path');
const fs = require('fs');
const pool = require('../config/database');

const migrationsPath = path.join(__dirname);
const migrationFiles = fs.readdirSync(migrationsPath).filter((file) => file.endsWith('.js') && file !== 'migrate.js');

async function runMigrations() {
  try {
    console.log('Running migrations...');
    for (const file of migrationFiles) {
      const migration = require(path.join(migrationsPath, file));
      console.log(`Applying migration: ${file}`);
      await pool.query(migration.up);
    }
    console.log('Migrations were successful');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await pool.end();
  }
}

runMigrations();
