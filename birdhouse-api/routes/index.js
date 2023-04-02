const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const messageController = require('../controllers/messageController');

router.get('/', function(req, res, next) {
  res.render('index');
});
router.post('/upload-image', imageController.multerUpload, imageController.uploadImage);
router.post('/post-message', messageController.postMessage);

module.exports = router;
