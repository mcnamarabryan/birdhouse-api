const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const { authenticate } = require('../utils/auth');

router.get('/', loginController.getLogin);

router.post('/auth', loginController.authLogin);

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
