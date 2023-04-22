const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.get('/get', auth, messageController.getMessage);

router.post('/post', auth, messageController.postMessage);

module.exports = router;
