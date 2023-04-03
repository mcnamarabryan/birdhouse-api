const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.get('/get', imageController.getImage);

router.post('/post', imageController.multerUpload, imageController.postImage);

module.exports = router;
