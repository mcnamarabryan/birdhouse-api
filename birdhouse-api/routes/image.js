const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const auth = require('../middleware/auth');

router.get('/get', auth, imageController.getImage);

router.post('/post', auth, imageController.multerUpload, imageController.postImage);

module.exports = router;
