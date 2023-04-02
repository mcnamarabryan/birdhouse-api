const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/get', messageController.getMessage);
router.post('/post', messageController.postMessage);

module.exports = router;
