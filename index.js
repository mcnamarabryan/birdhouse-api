const express = require('express');
const app = express();
const pool = require('./utils/db');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoints
app.use('/api/login', require('./routes/login'));
app.use('/api/image', require('./routes/image'));
app.use('/api/log', require('./routes/log'));

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = {
  app,
  server,
  port,
};
