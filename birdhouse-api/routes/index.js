const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const messageController = require('../controllers/messageController');

router.post('/upload-image', imageController.multerUpload, imageController.uploadImage);
router.post('/post-message', messageController.postMessage);

module.exports = router;
